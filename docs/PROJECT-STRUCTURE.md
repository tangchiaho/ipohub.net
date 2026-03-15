# IPOHub Project Structure — Consolidation Report

This document defines the **primary** site structure, marks **duplicate** or **secondary** paths, and lists what to keep in active use. No files have been deleted.

---

## 1. Primary website (root)

These files are the **main site** and the canonical entry points. All links and navigation should point here.

| File | Purpose | Data source |
|------|---------|-------------|
| **index.html** | Home / landing | — |
| **radar.html** | IPO 雷達 | `data/ipo.json` |
| **pipeline.html** | IPO 管線 | `data/pipeline.json` |
| **companies.html** | 公司名單 | `data/companies.json` |
| **industry.html** | 產業情報 | `data/industries.json` |
| **style.css** | Shared styles | — |

- **Primary files**: `index.html`, `radar.html`, `pipeline.html`, `companies.html`, `industry.html`, `style.css`
- **Primary data**: `data/ipo.json`, `data/pipeline.json`, `data/companies.json`, `data/industries.json`

---

## 2. Duplicate / secondary page structures

These folders mirror or overlap the root pages. They are **not** the primary site. Treat as **secondary or unused** for now.

| Path | Duplicate of | Note |
|------|----------------|------|
| **ipo-radar/** | radar.html | Same content idea; uses `../data/ipo.json`. |
| **ipo-pipeline/** | pipeline.html | Same content idea; uses `../data/pipeline.json`. |
| **ipo-companies/** | companies.html | Same content idea; uses `../data/companies.json`. |
| **industry/** | industry.html | Same content idea; uses `../data/industries.json`. |
| **about/** | — | Standalone 關於 page; no root counterpart. Secondary. |
| **insights/** | — | Standalone 洞見 page; no root counterpart. Secondary. |

- **Duplicate files (safe to ignore for now)**:  
  `ipo-radar/index.html`, `ipo-pipeline/index.html`, `ipo-companies/index.html`, `industry/index.html`, `about/index.html`, `insights/index.html`

---

## 3. Data files — active use

Keep under **`/data`** and use as below. No change to file names or locations.

| Data file | Used by | Purpose |
|-----------|---------|---------|
| **data/ipo.json** | radar.html | IPO 雷達 table |
| **data/pipeline.json** | pipeline.html | IPO 管線 table |
| **data/companies.json** | companies.html | 公司名單 cards |
| **data/industries.json** | industry.html | 產業情報 sector cards |

All four are in **active use** by the primary root pages.

---

## 4. Other files — remain in active use

- **CNAME** — GitHub Pages custom domain (e.g. ipohub.net).
- **README.md** — Project readme.
- **data/** — All JSON files above; scripts may write `data/ipo.json`.
- **scripts/** — Taiwan IPO fetch (e.g. `scripts/fetch-taiwan-ipo.js`); run locally or in CI, outputs `data/ipo.json`.
- **docs/** — Schema and structure docs (e.g. `docs/ipo-pipeline-schema.md`, this file).
- **.github/workflows/** — Optional CI (e.g. update-ipo-data.yml).
- **.gitignore** — e.g. `scripts/node_modules/`.

---

## 5. Summary

| Category | Items |
|----------|--------|
| **Primary (root) pages** | index.html, radar.html, pipeline.html, companies.html, industry.html, style.css |
| **Primary data** | data/ipo.json, data/pipeline.json, data/companies.json, data/industries.json |
| **Duplicate / secondary (ignore for now)** | ipo-radar/, ipo-pipeline/, ipo-companies/, industry/, about/, insights/ |
| **Remain in active use** | CNAME, README.md, data/*.json, scripts/, docs/, .github/workflows/, .gitignore |

---

## 6. Navigation and links

- Point all navigation and internal links to **root HTML files**:  
  `index.html`, `radar.html`, `pipeline.html`, `companies.html`, `industry.html`.
- Do **not** link the main nav to `/ipo-radar/`, `/ipo-companies/`, `/ipo-pipeline/`, `/industry/`, `/about/`, `/insights/` unless you later promote those paths to primary.

---

## 7. GitHub Pages compatibility

- The **primary** site is fully static: root HTML + style.css + client-side `fetch()` of files under `data/`.
- Relative paths `data/ipo.json`, `data/pipeline.json`, etc. work when the site is served from the repo root.
- No server-side rendering; duplicate folders are just alternate URLs and can be removed later if desired.
