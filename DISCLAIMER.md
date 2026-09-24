# Disclaimer

The exact text used in the product. Two pieces appear in the interface.

## 1. Persistent header badge

Shown at all times, above every answer and before any question is asked:

> Facts only · No investment advice

## 2. Footer disclaimer

Shown at the bottom of every page:

> Groww is a SEBI-registered broker and an AMFI-registered mutual fund distributor, not a SEBI-registered Investment Adviser. This assistant explains what official scheme documents say. It does not recommend investments, and it does not calculate returns.
>
> Last updated from sources: {DATE} IST

`{DATE}` is the most recent successful fetch across every source document, formatted in IST. It is read from `data/sources-manifest.csv` at render time, so it cannot claim a freshness the answers do not have.

## 3. Machine-readable disclaimer

Every API response carries the same sentence in its `disclaimer` field, so a consumer of the API cannot receive an answer without it:

```json
{ "disclaimer": "Facts only. No investment advice." }
```

## Why it is worded this way

Groww Asset Management Limited is a SEBI-registered mutual fund (Reg. MF/068//11/03) and an AMFI-registered distributor. A distributor may **explain facts**. It may **not recommend**. The badge states the boundary before a question is asked; the footer states the regulatory basis for it; the API field ensures it travels with the data.

Refusals are part of that boundary, not errors. Questions asking whether to invest, which fund is better, how returns compare, or anything about the user's own portfolio are declined with an educational link rather than answered.
