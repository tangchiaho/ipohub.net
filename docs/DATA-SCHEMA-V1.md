# V1 Data Schema (Taiwan Company Lookup & Pipeline)

IPOHub V1 uses two JSON files for Taiwan company lookup and pipeline tracking. `data/ipo.json` is unchanged and used by the radar.

---

## data/companies.json

Array of company master records. One object per company.

| Field      | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `ticker`  | string | Yes      | 股票代號 (e.g. 7899, 7883). |
| `name`    | string | Yes      | 公司名稱（中文）. |
| `nameEn`  | string \| null | No | English name; `null` if not set. |
| `sector`  | string | No       | 產業/類別 (e.g. 電子, 觀光餐飲, 生技). |
| `market`  | string | No       | 目前市場 (e.g. 興櫃, 上櫃, 上市). |
| `status`  | string | No       | Current stage key (e.g. listed_emerging). |
| `updatedAt` | string | No     | Last update date `YYYY-MM-DD`. |

---

## data/pipeline.json

Array of pipeline events. One object per event; link to company by `ticker`. A company can have multiple events (one per stage reached).

| Field     | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `ticker`  | string | Yes      | 股票代號; links to `companies.json`. |
| `stage`   | string | Yes      | Stage label in Chinese (e.g. 登錄興櫃). |
| `stageKey`| string | Yes      | Machine key for ordering (e.g. listed_emerging). |
| `date`    | string | No       | Event date `YYYY-MM-DD`. |
| `source`  | string | No       | Data source: tpex, mops, twse, etc. |
| `url`     | string | No       | Link to official page or prospectus. |
| `note`    | string \| null | No | Optional note. |

### Stage order (Taiwan capital market)

1. 公開發行 — `public_disclosure`
2. 公開說明書 — `prospectus`
3. 登錄興櫃 — `listed_emerging`
4. 申請上櫃 — `apply_otc`
5. 上櫃 — `listed_otc`
6. 申請上市 — `apply_twse`
7. 上市 — `listed_twse`

---

## data/ipo.json

Unchanged in V1. Used by the IPO radar; see `docs/ipo-pipeline-schema.md` for its schema.
