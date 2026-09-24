# Sample questions and answers

Eight exchanges captured **verbatim** from the live deployment on 2026-09-24. Nothing below is retyped, shortened, or tidied: each block is the exact `answer` string the API returned, with its real citations.

Four are factual answers across different schemes and fact types (one of which asks for a plan first). The remaining four are the refusal paths, which are features of this product rather than error cases.

---

## 1. Fact — expense ratio (Large Cap, Direct)

**Question:** What is the expense ratio of Groww Large Cap Fund direct plan?

**`answerType`:** `fact`

**Answer:**

> The expense ratio of Groww Large Cap Fund (Direct plan) is 1.69%, as stated in the TER disclosure dated 20 September 2026.

**Citations:**

| Title | Publisher | Document | Effective date |
|---|---|---|---|
| [Total Expense Ratio Disclosure — 20 Sep 2026 (Direct & Regular, per scheme)](https://growwmf.in/downloads/expense-ratio) | Groww Asset Management Limited | `ter_disclosure` | 2026-09-20 |

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 2. Fact — graded exit load (Liquid)

**Question:** What is the exit load on Groww Liquid Fund?

**`answerType`:** `fact`

**Answer:**

> The exit load for Groww Liquid Fund is graded by holding period: 0.007% if exited within 0 to 1 days from the purchase NAV date; 0.0065% if exited within 2 days from the purchase NAV date; 0.006% if exited within 3 days from the purchase NAV date; 0.0055% if exited within 4 days from the purchase NAV date; 0.005% if exited within 5 days from the purchase NAV date; 0.0045% if exited within 6 days from the purchase NAV date; Nil if exited after 7 Days from the purchase NAV date.

**Citations:**

| Title | Publisher | Document | Effective date |
|---|---|---|---|
| [Groww Liquid Fund Direct Growth](https://growwmf.in/mutual-funds/groww-liquid-fund-direct-growth) | Groww Asset Management Limited | `scheme_page` | not stated — retrieved 2026-09-21 |

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 3. Fact — riskometer with effective date (policy row 4)

**Question:** What is the riskometer rating for Groww Liquid Fund?

**`answerType`:** `fact`

**Answer:**

> Groww Liquid Fund is rated "Low to Moderate" on the riskometer, as of 31 August 2026.

**Citations:**

| Title | Publisher | Document | Effective date |
|---|---|---|---|
| [Riskometer Disclosure — FY 2026-27 (monthly, Apr-Aug 2026)](https://growwmf.in/downloads/riskometer) | Groww Asset Management Limited | `riskometer_disclosure` | 2026-08-31 |

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 4. Fact — plan disambiguation (policy row 12)

**Question:** What is the expense ratio of Groww ELSS Tax Saver Fund?

**`answerType`:** `disambiguation`

**Answer:**

> The expense ratio differs between the Direct and Regular plans of Groww ELSS Tax Saver Fund. Which plan do you mean?

**Options offered:** `Direct plan` · `Regular plan`

**Citations:** none — a refusal/disambiguation cites nothing, because it asserts nothing.

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 5. Advice refusal (policy row 5)

**Question:** Should I invest in Groww ELSS Tax Saver Fund?

**`answerType`:** `advice_refusal`

**Answer:**

> I can explain what the official documents say about these schemes, but I can't tell you whether to invest — Groww is a distributor, not a SEBI-registered investment adviser. For unbiased help with that decision, AMFI's investor education resources are a good starting point.

**Educational link:** <https://www.amfiindia.com/investor>

**Citations:** none — a refusal cites nothing, because it asserts nothing.

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 6. PII refusal (policy row 8)

**Question:** My PAN is ABCDE1234F, what is my balance?

**`answerType`:** `pii_refusal`

**Answer:**

> I can't work with messages that contain personal identifiers such as a PAN, Aadhaar, phone number, email, folio or account number, and I don't have access to your holdings. Please remove those details and ask again.

**Citations:** none — a refusal cites nothing, because it asserts nothing.

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 7. Out of corpus (policy row 9)

**Question:** What is the expense ratio of HDFC Flexi Cap Fund?

**`answerType`:** `out_of_scope`

**Answer:**

> That fund is outside my sources — I only cover Groww Mutual Fund schemes, and only four of them. I can answer factual questions about four Groww Mutual Fund schemes: Groww Large Cap Fund, Groww ELSS Tax Saver Fund, Groww Nifty Total Market Index Fund and Groww Liquid Fund.

**Citations:** none — a refusal cites nothing, because it asserts nothing.

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`

---

## 8. Low confidence / no source (policy row 10)

**Question:** When was the battle of Panipat?

**`answerType`:** `no_source`

**Answer:**

> I couldn't find that in my sources, so I won't guess. I can answer factual questions about four Groww Mutual Fund schemes: Groww Large Cap Fund, Groww ELSS Tax Saver Fund, Groww Nifty Total Market Index Fund and Groww Liquid Fund.

**Citations:** none — a refusal cites nothing, because it asserts nothing.

*Disclaimer returned with this response:* "Facts only. No investment advice."  ·  *corpus:* `2026-09-21-a963e690`
