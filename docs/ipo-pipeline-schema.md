# IPO Pipeline JSON Schema (Taiwan Integration)

## Overview

`data/ipo.json` is an array of IPO pipeline records. Each record can come from **Taiwan sources** (TPEx, MOPS, TWSE) or other sources. The schema is backward-compatible with the existing radar/pipeline pages.

## Record Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company` | string | Yes | Company name (中文 or English). |
| `sector` | string | No | Sector or category (e.g. 興櫃, 消費性網路). Default display: use as-is or "—". |
| `market` | string | Yes | Exchange or market (e.g. TPEx, 興櫃, TWSE, NYSE). |
| `status` | string | Yes | One of: `Listed`, `Filed`, `Priced`, `Expected`, `Withdrawn`. |
| `filingDate` | string | No | Date in `YYYY-MM-DD` or `TBD`. |
| `listingDate` | string | No | Listing date `YYYY-MM-DD` when applicable. |
| `source` | string | No | Data source: `tpex`, `mops`, `twse`, or omit for non-Taiwan. |
| `ticker` | string | No | Stock code (e.g. 7899, 2330). |
| `url` | string | No | Link to official page or prospectus. |
| `note` | string | No | Optional note for pipeline view. |

## Taiwan Sources

- **TPEx (櫃買中心)** – 興櫃登錄: [最近登錄興櫃公司](https://www.tpex.org.tw/zh-tw/esb/listed/ipo.html). Records: `source: "tpex"`, `market: "興櫃"` or `"TPEx"`, `status: "Listed"`, `listingDate` from 登錄日期 (ROC date → YYYY-MM-DD).
- **MOPS (公開資訊觀測站)** – 公開說明書申報: [t57sb01](https://mops.twse.com.tw/mops/#/web/t57sb01_q3). Records: `source: "mops"`, `market: "TWSE"` or `"TPEx"`, `status: "Filed"` or `"Listed"`.
- **TWSE (證交所)** – 上市申請: [申請上市公司](https://www.twse.com.tw/zh/listed/listed/apply-listing.html). Records: `source: "twse"`, `market: "TWSE"`, `status: "Pending"` or `"Approved"`.

## ROC (Republic of China) Year

Taiwan uses ROC year. Convert to Western year: `AD year = ROC year + 1911` (e.g. 115 → 2026).

## Example (Taiwan TPEx)

```json
{
  "company": "景美",
  "sector": "—",
  "market": "興櫃",
  "status": "Listed",
  "filingDate": "2026-02-25",
  "listingDate": "2026-02-25",
  "source": "tpex",
  "ticker": "7899",
  "url": "https://www.tpex.org.tw/zh-tw/esb/listed/ipo/detail.html?code=7899&date=2026"
}
```

## Output

- **Path**: `data/ipo.json`
- **Format**: JSON array of records, sorted by date (newest first) or by source then date.
- **Encoding**: UTF-8.
- **GitHub Pages**: This file is served statically. Update it by running the fetch script locally or in CI (e.g. GitHub Actions), then commit and push.
