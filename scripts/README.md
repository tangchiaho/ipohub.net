# Taiwan IPO Data Integration Scripts

Scripts fetch IPO pipeline data from Taiwan sources and write `data/ipo.json` for use by the static site (GitHub Pages).

## Schema

See [../docs/ipo-pipeline-schema.md](../docs/ipo-pipeline-schema.md) for the JSON schema and field descriptions.

## Sources

| Source | URL | Description |
|--------|-----|-------------|
| **TPEx** | [最近登錄興櫃公司](https://www.tpex.org.tw/zh-tw/esb/listed/ipo.html) | 興櫃登錄名單，表格解析 |
| **TWSE** | [申請上市公司](https://www.twse.com.tw/zh/listed/listed/apply-listing.html) | 上市申請，頁面為 JS 載入，目前為 stub |
| **MOPS** | [公開說明書](https://mops.twse.com.tw/mops/#/web/t57sb01_q3) | 申報書查詢，直接 API 常被擋，目前為 stub |

## Setup

```bash
cd scripts
npm install
```

Requires **Node.js 18+** (for native `fetch`; this script uses `https`/`http` and `cheerio` only).

## Run

From **repo root**:

```bash
node scripts/fetch-taiwan-ipo.js
```

Or from `scripts/`:

```bash
npm run fetch-ipo
```

**Merge with existing `data/ipo.json`** (e.g. keep US/global sample data and add Taiwan):

```bash
node scripts/fetch-taiwan-ipo.js --merge
```

Output is written to `data/ipo.json`. Commit and push to update the live site.

## GitHub Pages Compatibility

- The **site** does not run these scripts. It only serves static files, including `data/ipo.json`.
- Run the script **before** deploy: locally or in CI (e.g. GitHub Actions).
- Recommended: add a scheduled workflow (e.g. daily or weekly) that runs `node scripts/fetch-taiwan-ipo.js`, commits `data/ipo.json` if changed, and pushes so GitHub Pages serves the latest data.

## Optional: GitHub Actions

A workflow file is provided at `.github/workflows/update-ipo-data.yml`. It runs on a schedule and on manual trigger. Enable it if you want automatic updates; ensure the repo has write access for the workflow to push.
