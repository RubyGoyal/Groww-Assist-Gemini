export interface GlossaryTerm {
  term: string;
  shortDef: string;
  source: string;
  details: string;
}

export const FINANCIAL_GLOSSARY: Record<string, GlossaryTerm> = {
  ter: {
    term: "Total Expense Ratio (TER)",
    shortDef: "Annual operating cost of running a scheme expressed as a percentage of daily net assets.",
    source: "SEBI Mutual Fund Regulations, Regulation 52",
    details:
      "Includes management fees, registrar and transfer agent fees, custodian fees, and marketing/distribution costs. Daily NAVs are published after deducting the proportional TER.",
  },
  exit_load: {
    term: "Exit Load",
    shortDef: "A fee deducted from redemption proceeds if units are redeemed within a specified holding period.",
    source: "AMFI Investor Education & Scheme SID",
    details:
      "Designed to discourage short-term redemptions. Funds like Groww Liquid Fund use a day-wise graded exit load during days 1 to 6 (0.007% down to 0.0045%), becoming Nil on Day 7.",
  },
  elss: {
    term: "ELSS (Equity Linked Savings Scheme)",
    shortDef: "Equity mutual fund offering tax deduction under Section 80C with a mandatory 3-year lock-in.",
    source: "Central Board of Direct Taxes & AMFI",
    details:
      "Has the shortest lock-in period among Section 80C options (3 years). For SIPs, each monthly installment has its own separate 3-year lock-in starting from the date of allotment.",
  },
  direct_vs_regular: {
    term: "Direct Plan vs Regular Plan",
    shortDef: "Direct plans bypass intermediaries; Regular plans include distributor commissions.",
    source: "SEBI Circular SEBI/HO/IMD/DF2/CIR/P/2012/175",
    details:
      "Direct plans have a lower Total Expense Ratio and thus a higher Net Asset Value (NAV) over time because no distributor trail commission is paid.",
  },
  riskometer: {
    term: "Riskometer",
    shortDef: "Standardized SEBI 6-level visual risk indicator evaluated monthly.",
    source: "SEBI Circular on Product Labeling in Mutual Funds",
    details:
      "Levels range from Low, Low to Moderate, Moderate, Moderately High, High, to Very High based on portfolio duration, credit rating, and equity volatility.",
  },
  kim_sid: {
    term: "SID & KIM",
    shortDef: "Scheme Information Document and Key Information Memorandum.",
    source: "SEBI Mutual Fund Regulations",
    details:
      "SID is the comprehensive legal prospectus covering investment strategy, asset allocation, and fees. KIM is a concise summary attached to the investment application form.",
  },
  cas: {
    term: "Consolidated Account Statement (CAS)",
    shortDef: "Single statement showing all mutual fund holdings and demat accounts linked to a PAN.",
    source: "AMFI / CAMS / KFintech / Depositories",
    details:
      "Sent monthly by RTAs or depositories when transactions occur, or half-yearly if no transactions occurred. Can be downloaded on demand from KFintech or CAMS portals.",
  },
  benchmark: {
    term: "Benchmark Index",
    shortDef: "The standard market index against which the performance of a fund is measured.",
    source: "AMFI & SEBI Categorization Framework",
    details:
      "For instance, Groww Large Cap Fund tracks the NIFTY 100 TRI, while Groww Nifty Total Market Index Fund tracks the Nifty Total Market Index TRI.",
  },
};
