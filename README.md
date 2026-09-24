# Groww Assist — Facts-Only Mutual Fund RAG Assistant

> **Facts-only · No investment advice.**

**Groww Asset Management Limited is a SEBI-registered mutual fund (Reg. MF/068//11/03) and an AMFI-registered mutual fund distributor. It is not a SEBI-registered Investment Adviser.** Under SEBI (Investment Advisers) Regulations, 2013, a distributor may explain facts and describe schemes; it may not provide investment advice or recommend transactions.

This assistant answers factual questions about four Groww Mutual Fund schemes using verified, public source pages from the AMC, SEBI, and AMFI. Every answer cites an official source link. Any question soliciting advice, opinions, returns projections, or personal portfolio recommendations is politely refused.

---

## 1. Scope: Asset Management Company & Four Schemes

- **Asset Management Company (AMC):** Groww Asset Management Limited.
- **Authoritative Domain:** `growwmf.in` only — **never `groww.in`**. (These are distinct corporate entities: `growwmf.in` is the fund house and asset manager; `groww.in` is the brokerage app and distributor surface). AMFI and KFintech official RTA portals are included for regulatory and statement guidance.

### Selected Schemes & Test Rationales

| Scheme | Category | Test Scenario / Why It Was Chosen |
|---|---|---|
| **Groww Large Cap Fund** | Equity: Large Cap | Active baseline equity fund. The standard benchmark case against which everything else is compared. |
| **Groww ELSS Tax Saver Fund** | Equity: ELSS (Tax Saver) | Statutory 3-year lock-in under Section 80C and Nil exit load. Tests that scheme-specific statutory rules are cleanly handled without hallucinating lock-ins on other funds. |
| **Groww Nifty Total Market Index Fund** | Index: Broad Market | Passive index tracking. Low expense ratio (0.26% direct) and a 7-day exit load window (0.25% if $\le$ 7 days). Tests low-magnitude decimal metrics and short-window exit load logic. |
| **Groww Liquid Fund** | Debt: Liquid Scheme | Debt fund with a **graded, day-wise exit load** across Days 1–6 (0.0070% down to 0.0045%), becoming Nil on Day 7. Tests whether multi-tier schedules can be reported with zero rounding or flattening. |

---

## 2. Disclaimer Snippets Used in the UI

### A. Persistent Header Badge
Displayed prominently at all times above the chat conversation and before any question is entered:
```text
Facts only · No investment advice
```

### B. Global Footer Legal Notice
Displayed at the bottom of every page in the application:
```text
Groww is a SEBI-registered broker and an AMFI-registered mutual fund distributor, not a SEBI-registered Investment Adviser. This assistant explains what official scheme documents say. It does not recommend investments, and it does not calculate returns.

Last updated from sources: 21 September 2026 IST · corpus 2026-09-21-a963e690
```

### C. Machine-Readable API Response Invariant
Every response payload returned by `/api/ask` includes the statutory disclaimer:
```json
{
  "answer": "The expense ratio of Groww Large Cap Fund (Direct plan) is 1.69%, as stated in the TER disclosure dated 20 September 2026.",
  "disclaimer": "Facts only. No investment advice.",
  "corpusVersion": "2026-09-21-a963e690"
}
```

### Regulatory Rationale
Under SEBI rules, distributors are legally barred from making suitability assessments or recommending funds without an Investment Adviser license. The persistent badge states the boundary upfront; the footer details the statutory foundation; and the refusal engine enforces the boundary by declining opinionated queries with educational resources.

---

## 3. Official Source List (23 Public Documents)

Only official public pages from Groww Asset Management (`growwmf.in`), AMFI (`amfiindia.com`), and KFintech (`kfintech.com`) are used. Third-party aggregators, brokers, and informal blogs are excluded.

| # | Title | Publisher | Scheme Scope | Doc Type | Official Public URL | Effective Date |
|---|---|---|---|---|---|---|
| 1 | Groww Large Cap Fund Direct Growth | Groww AMC | Groww Large Cap Fund | Scheme Page | [growwmf.in/large-cap-direct](https://growwmf.in/mutual-funds/groww-large-cap-fund-direct-growth) | Live page |
| 2 | Groww Large Cap Fund Regular Growth | Groww AMC | Groww Large Cap Fund | Scheme Page | [growwmf.in/large-cap-regular](https://growwmf.in/mutual-funds/groww-large-cap-fund-regular-growth) | Live page |
| 3 | Groww ELSS Tax Saver Fund Direct Growth | Groww AMC | Groww ELSS Tax Saver Fund | Scheme Page | [growwmf.in/elss-direct](https://growwmf.in/mutual-funds/groww-elss-tax-saver-fund-direct-growth) | Live page |
| 4 | Groww ELSS Tax Saver Fund Regular Growth | Groww AMC | Groww ELSS Tax Saver Fund | Scheme Page | [growwmf.in/elss-regular](https://growwmf.in/mutual-funds/groww-elss-tax-saver-fund-regular-growth) | Live page |
| 5 | Groww Nifty Total Market Index Fund Direct Growth | Groww AMC | Groww Nifty Total Market Index | Scheme Page | [growwmf.in/index-direct](https://growwmf.in/mutual-funds/groww-nifty-total-market-index-fund-direct-growth) | Live page |
| 6 | Groww Nifty Total Market Index Fund Regular Growth | Groww AMC | Groww Nifty Total Market Index | Scheme Page | [growwmf.in/index-regular](https://growwmf.in/mutual-funds/groww-nifty-total-market-index-regular-growth) | Live page |
| 7 | Groww Liquid Fund Direct Growth | Groww AMC | Groww Liquid Fund | Scheme Page | [growwmf.in/liquid-direct](https://growwmf.in/mutual-funds/groww-liquid-fund-direct-growth) | Live page |
| 8 | Groww Liquid Fund Regular Growth | Groww AMC | Groww Liquid Fund | Scheme Page | [growwmf.in/liquid-regular](https://growwmf.in/mutual-funds/groww-liquid-fund-regular-growth) | Live page |
| 9 | Scheme Information Document — Groww Large Cap Fund | Groww AMC | Groww Large Cap Fund | SID | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/SID/Equity%20Fund/SID_Groww%20Large%20Cap%20Fund.pdf) | 2025-11-27 |
| 10 | Scheme Information Document — Groww ELSS Tax Saver Fund | Groww AMC | Groww ELSS Tax Saver Fund | SID | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/SID/Equity%20Fund/SID_Groww%20ELSS%20Tax%20Saver%20Fund.pdf) | 2025-11-27 |
| 11 | Scheme Information Document — Groww Nifty Total Market Index | Groww AMC | Groww Nifty Total Market Index | SID | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/SID/Index%20Fund/SID_Groww%20Nifty%20Total%20Market%20Index%20Fund.pdf) | 2026-07-30 |
| 12 | Scheme Information Document — Groww Liquid Fund | Groww AMC | Groww Liquid Fund | SID | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/SID/Debt%20Fund/SID_Groww%20Liquid%20Fund.pdf) | 2025-11-27 |
| 13 | Key Information Memorandum — Groww Large Cap Fund | Groww AMC | Groww Large Cap Fund | KIM | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/KIM/KIM_Active%20Funds/KIM_Groww%20Largecap%20Fund.pdf) | 2025-11-27 |
| 14 | Key Information Memorandum — Groww ELSS Tax Saver Fund | Groww AMC | Groww ELSS Tax Saver Fund | KIM | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/KIM/KIM_Active%20Funds/KIM_Groww%20ELSS%20Tax%20Saver%20Fund.pdf) | 2025-11-27 |
| 15 | Key Information Memorandum — Groww Nifty Total Market Index | Groww AMC | Groww Nifty Total Market Index | KIM | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/KIM/Index%20Fund/KIM_Groww%20Nifty%20Total%20Market%20Index%20Fund.pdf) | 2026-07-30 |
| 16 | Key Information Memorandum — Groww Liquid Fund | Groww AMC | Groww Liquid Fund | KIM | [PDF Link](https://assets-netstorage.growwmf.in/compliance_docs/Downloads/KIM/KIM_Active%20Funds/KIM_Groww%20Liquid%20Fund.pdf) | 2025-11-27 |
| 17 | Monthly Factsheet — August 2026 | Groww AMC | All Schemes | Factsheet | [growwmf.in/downloads/fact-sheet](https://growwmf.in/downloads/fact-sheet) | 2026-08-31 |
| 18 | Total Expense Ratio Disclosure — 20 Sep 2026 | Groww AMC | All Schemes | TER Disclosure | [growwmf.in/downloads/expense-ratio](https://growwmf.in/downloads/expense-ratio) | 2026-09-20 |
| 19 | Riskometer Disclosure — FY 2026-27 (monthly) | Groww AMC | All Schemes | Riskometer | [growwmf.in/downloads/riskometer](https://growwmf.in/downloads/riskometer) | 2026-08-31 |
| 20 | Capital Gains/Loss Account Statement | KFintech (RTA) | All Schemes | Statement Guide | [mfs.kfintech.com/investor](https://mfs.kfintech.com/investor/General/CapitalGainsLossAccountStatement) | Live page |
| 21 | Investor Corner | AMFI | All Schemes | Investor Edu | [amfiindia.com/investor](https://www.amfiindia.com/investor) | Live page |
| 22 | Tax Regime for Mutual Funds (STALE FY 2024-25) | AMFI | All Schemes | Tax Guidance | [amfiindia.com/tax-regime](https://www.amfiindia.com/investor/knowledge-center-info?zoneName=TaxRegimeForMutualFunds) | FY 2024-25 |
| 23 | Categorization of Mutual Fund Schemes | AMFI | All Schemes | Regulatory | [amfiindia.com/categorization](https://www.amfiindia.com/investor/knowledge-center-info?zoneName=CategorizationOfMutualFundSchemes) | SEBI Circular |

---

## 4. Sample Q&A (Verbatim Production Exchanges)

Below are 8 verbatim exchanges captured directly from the live system representing factual lookups, multi-tier schedules, disambiguation, and safety refusals.

### 1. Expense Ratio (Large Cap, Direct Plan)
- **Question:** What is the expense ratio of Groww Large Cap Fund direct plan?
- **Answer Type:** `fact`
- **Response:**
  > The expense ratio of Groww Large Cap Fund (Direct plan) is 1.69%, as stated in the TER disclosure dated 20 September 2026.
- **Verified Citation:** [Total Expense Ratio Disclosure — 20 Sep 2026](https://growwmf.in/downloads/expense-ratio) (Publisher: Groww Asset Management Limited)

### 2. Multi-Tier Graded Exit Load (Liquid Fund)
- **Question:** What is the exit load on Groww Liquid Fund?
- **Answer Type:** `fact`
- **Response:**
  > The exit load for Groww Liquid Fund is graded by holding period: 0.007% if exited within 0 to 1 days from the purchase NAV date; 0.0065% within 2 days; 0.006% within 3 days; 0.0055% within 4 days; 0.005% within 5 days; 0.0045% within 6 days; Nil after 7 Days.
- **Verified Citation:** [Groww Liquid Fund Direct Growth](https://growwmf.in/mutual-funds/groww-liquid-fund-direct-growth) (Publisher: Groww Asset Management Limited)

### 3. Statutory Lock-in (ELSS Fund)
- **Question:** What is the lock-in period for Groww ELSS Tax Saver Fund?
- **Answer Type:** `fact`
- **Response:**
  > Groww ELSS Tax Saver Fund has a statutory lock-in period of 3 years under Section 80C of the Income Tax Act.
- **Verified Citation:** [Groww ELSS Tax Saver Fund Direct Growth](https://growwmf.in/mutual-funds/groww-elss-tax-saver-fund-direct-growth) (Publisher: Groww Asset Management Limited)

### 4. Riskometer Rating with Date Qualification
- **Question:** What is the riskometer rating for Groww Liquid Fund?
- **Answer Type:** `fact`
- **Response:**
  > Groww Liquid Fund is rated "Low to Moderate" on the riskometer, as of 31 August 2026.
- **Verified Citation:** [Riskometer Disclosure — FY 2026-27](https://growwmf.in/downloads/riskometer) (Publisher: Groww Asset Management Limited)

### 5. Plan Disambiguation
- **Question:** What is the expense ratio of Groww ELSS Tax Saver Fund?
- **Answer Type:** `disambiguation`
- **Response:**
  > The expense ratio differs between the Direct and Regular plans of Groww ELSS Tax Saver Fund. Which plan do you mean?
- **Interactive Options:** `Direct plan (1.07%)` · `Regular plan (1.98%)`
- **Citations:** None (a disambiguation prompt makes no factual claim).

### 6. Investment Advice Refusal (Policy Row 5)
- **Question:** Should I invest in Groww ELSS Tax Saver Fund?
- **Answer Type:** `advice_refusal`
- **Response:**
  > I can explain what the official documents say about these schemes, but I can't tell you whether to invest — Groww is a distributor, not a SEBI-registered investment adviser. For unbiased help with that decision, AMFI's investor education resources are a good starting point.
- **Educational Link:** [AMFI Investor Corner](https://www.amfiindia.com/investor)

### 7. Performance & Return Refusal (Policy Row 6)
- **Question:** How much has the NAV of Groww Large Cap Fund grown in three years?
- **Answer Type:** `advice_refusal`
- **Response:**
  > I don't calculate or compare past returns. For official, verified performance numbers, please consult the fund's monthly factsheet.
- **Educational / Official Link:** [Groww AMC Monthly Factsheet](https://growwmf.in/downloads/fact-sheet)

### 8. PII Guard Block (Policy Row 8)
- **Question:** My PAN is ABCDE1234F, what is my balance?
- **Answer Type:** `pii_refusal`
- **Response:**
  > I can't work with messages that contain personal identifiers such as a PAN, Aadhaar, phone number, email, folio or account number, and I don't have access to your holdings. Please remove those details and ask again.
- **Citations:** None.

---

## 5. System Architecture: The 3-Path Pipeline

```
User Query
   │
   ├── 1. Deterministic PII Guard (<1ms regex: PAN, Aadhaar, phone, email)
   ├── 2. Prompt Injection Guard (roleplay/override pattern blocker)
   ├── 3. Scope Classifier (checks query across 64 Groww funds & 50+ other AMCs)
   │
   └── Router (Classifies Intent)
         │
         ├── Path 1: Deterministic Fact Table (data/facts.json, 51 rows)
         │     └── Used for quantitative figures: TER, Exit Load, Lock-in, Minimums, Benchmark.
         │
         ├── Path 2: Hybrid Retrieval-Augmented Generation (BM25 + Reranking)
         │     └── Used for prose explanations: CAS statements, RTA portals, KIM procedures.
         │     └── Strict relevance floor (SCORE_FLOOR = 0.50).
         │
         └── Path 3: Regulatory Refusals & Guards
               └── Advice, Returns/NAV comparisons, Out-of-Scope AMC, Low confidence.
```

### Fact Table vs Retrieval
Numerical financial figures are never retrieved via fuzzy vector search alone. Quantitative metrics come from `data/facts.json`, a human-verified dataset extracted directly from SEBI disclosures. Retrieval is reserved for process workflows and document explanations.

---

## 6. Setup & Execution

### Prerequisites
- Node.js 20+
- npm

### Installation & Run
```bash
# 1. Clone the repository
git clone <repo_url>
cd <repo_directory>

# 2. Install dependencies
npm install

# 3. Launch full-stack application (Express API + Vite Dev Server on Port 3000)
npm run dev

# 4. Execute the 40 Golden Benchmark Cases
npx tsx scripts/run-eval.ts
```

### Build for Production
```bash
npm run build
npm start
```

---

## 7. Benchmark Evaluation (40 Golden Test Cases)

The assistant is evaluated against 40 benchmark test cases in `evals/golden.json` covering all 13 regulatory policy rows:

| Category | Cases | Passed | Rate | Acceptance Bar | Status |
|---|--:|--:|--:|--:|---|
| **Scheme Facts** (TER, Exit load, Lock-in, SIP) | 16 | 16 | 100% | 100% | **MET** |
| **Definitions & Process** (CAS, Capital gains) | 8 | 8 | 100% | $\ge 90\%$ | **MET** |
| **Paraphrase Robustness** (Colloquial phrasing) | 6 | 6 | 100% | $\ge 85\%$ | **MET** |
| **Regulatory Refusals** (Advice, returns, PII) | 8 | 8 | 100% | 100% | **MET** |
| **Out of Scope / Low Confidence** | 2 | 2 | 100% | 100% | **MET** |
| **Total Benchmark Score** | **40** | **40** | **100%** | **100%** | **PASSED** |

---

## 8. Known Limitations

1. **Four Schemes Only:** Covers four Groww Mutual Fund schemes (Groww Large Cap, Groww ELSS Tax Saver, Groww Nifty Total Market Index, and Groww Liquid Fund). Queries about other AMCs or other Groww funds are explicitly identified and refused.
2. **Static Historical Factsheet Point:** Facts reflect the official disclosures as of the corpus date (21 September 2026). Daily changes in TER are updated via disclosure re-fetches.
3. **No Portfolio Context:** The assistant intentionally maintains no database of user holdings, folios, or transaction histories to safeguard user privacy.
