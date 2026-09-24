# Groww Assist — Facts-Only Mutual Fund RAG Assistant

**Groww Asset Management Limited is a SEBI-registered mutual fund (Reg. MF/068//11/03) and an AMFI-registered mutual fund distributor. It is not a SEBI-registered Investment Adviser.** A distributor may explain facts; it may not recommend. This assistant therefore answers factual questions about four Groww Mutual Fund schemes using only official sources, cites a link on every answer, and politely refuses anything amounting to advice. The refusal path is a feature of the product, not an error case.

---

## Scope: four schemes, chosen for four different fact patterns

Each scheme is here because it tests the system against a different fact pattern:

| Scheme | Why it was chosen |
|---|---|
| **Groww Large Cap Fund** | Baseline active equity — the ordinary benchmark case everything else is measured against. |
| **Groww ELSS Tax Saver Fund** | The only scheme with a statutory 3-year lock-in and nil exit load. Tests that a fact which exists for one scheme and not others is handled without inventing an answer for the others. |
| **Groww Nifty Total Market Index Fund** | Passive index fund: low expense ratio, 0.25% exit load within 7 days. Tests the low end of the number range and a second exit-load shape. |
| **Groww Liquid Fund** | Debt fund with a **graded, day-wise exit load** — seven different rates depending on the day you exit. Tests whether the system can carry a multi-row fact without flattening or rounding it. |

Sources are **`growwmf.in` only — never `groww.in`**. These are different entities: `growwmf.in` is Groww Asset Management Limited, the fund house and a primary source; `groww.in` is the brokerage app, a distributor's marketing surface. AMFI and SEBI pages are also used. No third-party blogs, brokers or aggregators. The full list is in `data/sources.csv`.

---

## How an answer is produced: The 3-Path Architecture

```
question
  -> input validation
  -> PII guard          (deterministic regex, no model call, ~1ms)
  -> injection guard    (deterministic pattern detection, no model call)
  -> scheme scope check (deterministic matching across all 64 Groww schemes & other AMCs)
  -> router             (intent classification: fact, explanation, advice, returns, etc.)
  -> Path 1 fact table  |  Path 2 hybrid retrieval  |  Path 3 refusal
  -> generator          (streamed/synthesized, <=3 sentences, sources wrapped as data)
  -> citation validator (asserts cited id was in retrieved set; model never emits URLs)
  -> response
```

**Facts do not come from retrieval.** Numbers come from `data/facts.json`, a table of 51 rows read from official documents and signed off by a human. Retrieval only answers questions whose answer is explanation rather than a number. A retrieval system asked for "the expense ratio" can return the right-looking chunk from the wrong plan and state it with total confidence; in a financial product that is unacceptable.

The model can never produce a URL. It cites a `source_id`; the application maps that id to a verified link from the registry. A model that cannot emit a URL cannot invent one.

---

## Evaluation Results: 40 Golden Test Cases

Covering all 13 policy rows from the AI System Design specification:

| Category | Count | Passed | Rate | Bar | Result |
|---|--:|--:|--:|--:|---|
| Scheme facts | 16 | 16 | 100% | 100% | MET |
| Definitions / process | 8 | 8 | 100% | ≥90% | MET |
| Paraphrase | 6 | 6 | 100% | ≥85% | MET |
| Refusals | 8 | 8 | 100% | 100% | MET |
| Out-of-corpus / low confidence | 2 | 2 | 100% | 100% | MET |
| **Total** | **40** | **40** | **100%** | | **MET** |

---

## Deliverables & Files

- `DISCLAIMER.md` — The exact disclaimer snippet used in the UI
- `SAMPLE_QA.md` — 8 verbatim Q&A exchanges captured from production
- `SOURCES.csv` — Full manifest of 23 official public documents
- `evals/golden.json` — 40 benchmark cases across all 13 policy rows
