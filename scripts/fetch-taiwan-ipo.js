#!/usr/bin/env node
/**
 * IPOHub Taiwan IPO data integration
 * Fetches from TPEx (興櫃), TWSE (上市申請), MOPS (公開說明書) and outputs data/ipo.json.
 * Run from repo root: node scripts/fetch-taiwan-ipo.js
 * Or: npm run fetch-ipo --prefix scripts
 * GitHub Pages: run in CI or locally, commit data/ipo.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as https from 'https';
import * as http from 'http';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'data', 'ipo.json');

const USER_AGENT = 'IPOHub/1.0 (Taiwan IPO data integration; +https://github.com/ipohub-net/ipohub.net)';

/** ROC year to Western year: 115 -> 2026 */
function rocDateToIso(rocDateStr) {
  if (!rocDateStr || typeof rocDateStr !== 'string') return null;
  const m = rocDateStr.trim().match(/^(\d{2,3})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return null;
  const y = parseInt(m[1], 10) + 1911;
  const month = m[2].padStart(2, '0');
  const day = m[3].padStart(2, '0');
  return `${y}-${month}-${day}`;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8' },
      timeout: 15000
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

/**
 * Parse TPEx 興櫃 recently listed page.
 * Table: 序號, 股票代號, 公司名稱, 登錄日期, 每股面額, 公司概況資料, 公司網址
 */
async function fetchTpex() {
  const url = 'https://www.tpex.org.tw/zh-tw/esb/listed/ipo.html';
  const html = await fetchUrl(url);
  const $ = cheerio.load(html);
  const rows = [];
  const tableRows = $('table tbody tr').length ? $('table tbody tr') : $('table tr');
  tableRows.each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 4) return;
    const firstCell = $(tds[0]).text().trim();
    if (firstCell === '序號' || firstCell === '') return;
    const ticker = $(tds[1]).text().trim();
    const nameCell = $(tds[2]);
    const company = nameCell.find('a').length ? nameCell.find('a').first().text().trim() : nameCell.text().trim();
    const dateStr = $(tds[3]).text().trim();
    const listingDate = rocDateToIso(dateStr);
    const detailUrl = nameCell.find('a').attr('href');
    const baseUrl = 'https://www.tpex.org.tw';
    const urlFull = detailUrl ? (detailUrl.startsWith('http') ? detailUrl : new URL(detailUrl, baseUrl).href) : undefined;
    if (!company) return;
    rows.push({
      company: company.replace(/\s+/g, ' '),
      sector: '—',
      market: '興櫃',
      status: 'Listed',
      filingDate: listingDate || 'TBD',
      listingDate: listingDate || undefined,
      source: 'tpex',
      ticker: ticker || undefined,
      url: urlFull
    });
  });
  return rows;
}

/**
 * TWSE 申請上市公司 - page is JS-heavy; stub that returns [] until we have API or static export.
 */
async function fetchTwse() {
  const url = 'https://www.twse.com.tw/zh/listed/listed/apply-listing.html';
  try {
    const html = await fetchUrl(url);
    const $ = cheerio.load(html);
    const rows = [];
    $('table tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length < 2) return;
      const company = $(tds[1]).text().trim();
      if (!company) return;
      rows.push({
        company,
        sector: '—',
        market: 'TWSE',
        status: 'Pending',
        filingDate: undefined,
        source: 'twse'
      });
    });
    return rows;
  } catch (e) {
    console.warn('TWSE fetch skipped:', e.message);
    return [];
  }
}

/**
 * MOPS 公開說明書 - direct API often blocked; stub.
 */
async function fetchMops() {
  try {
    const url = 'https://mops.twse.com.tw/mops/web/ajax_t57sb01';
    await fetchUrl(url);
    return [];
  } catch (e) {
    console.warn('MOPS fetch skipped (often blocked):', e.message);
    return [];
  }
}

function mergeAndSort(tpex, twse, mops, existingRecords) {
  const byKey = new Map();
  function add(r) {
    const key = [r.source || '', r.ticker || '', r.company].join('|');
    if (!byKey.has(key)) byKey.set(key, r);
  }
  (existingRecords || []).forEach(add);
  tpex.forEach(add);
  twse.forEach(add);
  mops.forEach(add);
  const list = Array.from(byKey.values());
  list.sort((a, b) => {
    const da = a.filingDate || a.listingDate || '0000-00-00';
    const db = b.filingDate || b.listingDate || '0000-00-00';
    if (da === 'TBD' && db !== 'TBD') return 1;
    if (db === 'TBD' && da !== 'TBD') return -1;
    return db.localeCompare(da);
  });
  return list;
}

async function main() {
  const merge = process.argv.includes('--merge');
  let existing = [];
  if (merge) {
    try {
      const raw = fs.readFileSync(OUTPUT_PATH, 'utf-8');
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch (_) {}
  }

  console.log('Fetching TPEx 興櫃...');
  const tpex = await fetchTpex();
  console.log('TPEx:', tpex.length, 'rows');

  console.log('Fetching TWSE...');
  const twse = await fetchTwse();
  console.log('TWSE:', twse.length, 'rows');

  console.log('Fetching MOPS...');
  const mops = await fetchMops();
  console.log('MOPS:', mops.length, 'rows');

  const merged = mergeAndSort(tpex, twse, mops, merge ? existing : null);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  console.log('Wrote', merged.length, 'records to', OUTPUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
