export type ScopeClass = "in_scope" | "other_groww" | "other_amc" | "none";

export interface ScopeResult {
  scope: ScopeClass;
  matched: string[];
  schemes: string[];
}

export const IN_SCOPE_SCHEMES = [
  "Groww ELSS Tax Saver Fund",
  "Groww Large Cap Fund",
  "Groww Liquid Fund",
  "Groww Nifty Total Market Index Fund",
];

export const IN_SCOPE_ALIASES: Record<string, string[]> = {
  "groww-large-cap": ["groww large cap fund", "large cap fund", "large cap", "largecap"],
  "groww-elss-tax-saver": ["groww elss tax saver fund", "elss tax saver", "tax saver fund", "tax saver", "tax saving", "elss"],
  "groww-nifty-total-market-index": [
    "groww nifty total market index fund",
    "nifty total market index fund",
    "nifty total market",
    "total market index",
    "total market fund",
    "index fund",
  ],
  "groww-liquid": ["groww liquid fund", "liquid fund", "liquid scheme"],
};

export const OTHER_AMC_PATTERNS: string[] = [
  "hdfc", "sbi", "icici", "icici prudential", "axis", "kotak", "nippon", "nippon india",
  "aditya birla", "birla sun life", "absl", "uti", "mirae", "mirae asset", "dsp", "franklin",
  "franklin templeton", "tata", "motilal", "motilal oswal", "parag parikh", "ppfas", "bandhan",
  "edelweiss", "canara robeco", "invesco", "sundaram", "lic mf", "lic mutual fund", "baroda bnp",
  "hsbc", "mahindra manulife", "pgim", "navi", "zerodha", "samco", "whiteoak", "white oak",
  "360 one", "iti mutual fund", "jm financial", "bajaj finserv", "shriram", "helios", "old bridge",
  "quantum", "nj mutual fund", "taurus", "union mutual fund", "union mf", "trust mutual fund",
  "trust mf", "quant mutual fund", "quant amc", "quant fund",
];

export const ALL_GROWW_SCHEMES: string[] = [
  "Groww Aggressive Hybrid Fund",
  "Groww Arbitrage Fund",
  "Groww Banking & Financial Services Fund",
  "Groww BSE Hospitals ETF",
  "Groww BSE Hospitals ETF FOF",
  "Groww BSE Power ETF",
  "Groww BSE Power ETF FOF",
  "Groww Dynamic Term Fund",
  "Groww ELSS Tax Saver Fund",
  "Groww Gilt Fund",
  "GROWW Gold ETF",
  "Groww Gold ETF FOF",
  "Groww Large Cap Fund",
  "Groww Liquid Fund",
  "Groww Money Market Fund",
  "Groww Multi Asset Allocation Fund",
  "Groww Multi Asset Omni FOF",
  "Groww Multicap Fund",
  "GROWW NIFTY 1D Rate Liquid ETF",
  "GROWW NIFTY 200 ETF",
  "Groww Nifty 200 ETF FOF",
  "Groww Nifty 50 ETF",
  "Groww Nifty 50 Index Fund",
  "Groww Nifty 500 Low Volatility 50 ETF",
  "Groww Nifty 500 Momentum 50 ETF",
  "Groww Nifty 500 Momentum 50 ETF FOF",
  "Groww Nifty Capital Markets ETF",
  "Groww Nifty Capital Markets ETF FOF",
  "Groww Nifty Cements ETF",
  "Groww Nifty Chemicals ETF",
  "Groww Nifty EV & New Age Automotive ETF",
  "Groww Nifty EV & New Age Automotive ETF FOF",
  "Groww Nifty India Defence ETF",
  "Groww Nifty India Defence ETF FOF",
  "Groww Nifty India internet ETF",
  "Groww Nifty India internet ETF FOF",
  "Groww Nifty India Railways Index Fund",
  "Groww Nifty India Railways PSU ETF",
  "Groww Nifty India Railways PSU Index Fund",
  "Groww Nifty Metal ETF",
  "Groww Nifty Midcap 150 ETF",
  "Groww Nifty Midcap 150 Index Fund",
  "Groww Nifty Next 50 ETF",
  "Groww Nifty Next 50 Index Fund",
  "Groww Nifty Non Cyclical Consumer Index Fund",
  "Groww Nifty Non-Cyclical Consumer Index Fund",
  "Groww Nifty Private Bank ETF",
  "Groww Nifty Private Bank Index Fund",
  "Groww Nifty PSE ETF",
  "Groww Nifty PSE ETF FOF",
  "Groww Nifty PSU Bank ETF",
  "Groww Nifty PSU Bank Index Fund",
  "Groww Nifty Realty ETF",
  "Groww Nifty Smallcap 250 ETF",
  "Groww Nifty Smallcap 250 Index Fund",
  "Groww Nifty Smallcap 250 Momentum Quality 100 ETF",
  "Groww Nifty Smallcap 250 Momentum Quality 100 Index Fund",
  "Groww Nifty Total Market Index Fund",
  "Groww Overnight Fund",
  "Groww Short Term Fund",
  "Groww Silver ETF",
  "Groww Silver ETF FOF",
  "Groww Small Cap Fund",
  "Groww Value Fund"
];

function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function contains(normalizedQuery: string, phrase: string): boolean {
  return normalizedQuery.includes(` ${normalize(phrase).trim()} `);
}

const inScopeKeys = new Set(IN_SCOPE_SCHEMES.map((s) => normalize(s).trim()));

const otherGrowwVariants = ALL_GROWW_SCHEMES
  .filter((s) => !inScopeKeys.has(normalize(s).trim()))
  .map((display) => {
    const full = normalize(display).trim();
    const withoutBrand = full.replace(/^groww /, "");
    const variants = new Set([full, withoutBrand]);
    const core = withoutBrand.replace(/\s+(fund|etf|fof|etf fof)$/, "");
    const looksLikeBareIndex = /^(nifty|bse|crisil|sensex)\b/.test(core);
    if (core !== withoutBrand && core.split(" ").length >= 2 && !looksLikeBareIndex) {
      variants.add(core);
    }
    return { display, variants: [...variants] };
  });

export function classifyScope(query: string): ScopeResult {
  const q = normalize(query);

  // 1. Another fund house named anywhere -> other_amc
  const amcHits = OTHER_AMC_PATTERNS.filter((p) => contains(q, p));
  if (amcHits.length > 0) {
    return { scope: "other_amc", matched: amcHits, schemes: [] };
  }

  // 2. Another Groww scheme named -> other_groww
  const otherHits = otherGrowwVariants.filter((s) => s.variants.some((v) => contains(q, v)));
  if (otherHits.length > 0) {
    return { scope: "other_groww", matched: otherHits.map((s) => s.display), schemes: [] };
  }

  // 3. One or more of our four in-scope schemes
  const schemes: string[] = [];
  const matched: string[] = [];
  for (const [slug, aliases] of Object.entries(IN_SCOPE_ALIASES)) {
    const hit = aliases.find((a) => contains(q, a));
    if (hit) {
      schemes.push(slug);
      matched.push(hit);
    }
  }
  if (schemes.length > 0) {
    return { scope: "in_scope", matched, schemes };
  }

  // 4. No specific scheme named (general question or query without fund name)
  return { scope: "none", matched: [], schemes: [] };
}
