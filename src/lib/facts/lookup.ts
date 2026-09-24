import type { FactRow, FactType, Plan, Citation } from "../types.ts";
import { toCitation } from "../sources/registry.ts";

// Import facts directly from verified dataset
import factsData from "../../../data/facts.json";

export const SCHEME_DISPLAY: Record<string, string> = {
  "groww-large-cap": "Groww Large Cap Fund",
  "groww-elss-tax-saver": "Groww ELSS Tax Saver Fund",
  "groww-nifty-total-market-index": "Groww Nifty Total Market Index Fund",
  "groww-liquid": "Groww Liquid Fund",
};

export const SCHEME_SLUGS = Object.keys(SCHEME_DISPLAY);

export const FACT_TYPES: FactType[] = [
  "expense_ratio",
  "exit_load",
  "lock_in",
  "min_sip",
  "min_lumpsum",
  "benchmark",
  "riskometer",
  "fund_manager",
  "category",
];

const facts: FactRow[] = (factsData as FactRow[]).filter((r) => r.verified_by !== null);

export function loadFacts(): FactRow[] {
  return facts;
}

export function schemesWithFact(factType: FactType): string[] {
  const present = new Set(loadFacts().filter((r) => r.fact_type === factType).map((r) => r.scheme));
  return SCHEME_SLUGS.filter((s) => present.has(s));
}

export function variesByPlan(factType: FactType): boolean {
  return factType === "expense_ratio";
}

export type LookupResult =
  | { kind: "answer"; answer: string; citations: Citation[] }
  | { kind: "needs_plan"; scheme: string; factType: FactType }
  | { kind: "needs_scheme"; factType: FactType }
  | { kind: "miss" };

export function lookupFact(factType: FactType, scheme: string | null, plan: Plan | null): LookupResult {
  const all = loadFacts().filter((r) => r.fact_type === factType);

  if (scheme) {
    let rows = all.filter((r) => r.scheme === scheme);
    if (rows.length === 0) return { kind: "miss" }; // N3: fall through to Path 2
    if (variesByPlan(factType)) {
      if (!plan) return { kind: "needs_plan", scheme, factType };
      rows = rows.filter((r) => r.plan === plan);
      if (rows.length === 0) return { kind: "miss" };
    }
    return { kind: "answer", answer: phrase(factType, scheme, plan, rows), citations: citationsFor(rows) };
  }

  // No scheme named: If the fact is plan-independent and there's 1 row per scheme, answer for all four
  if (!variesByPlan(factType)) {
    const perScheme = SCHEME_SLUGS.map((s) => all.filter((r) => r.scheme === s));
    if (perScheme.every((rs) => rs.length === 1)) {
      const rows = perScheme.flat();
      return { kind: "answer", answer: phraseAllSchemes(factType, rows), citations: citationsFor(rows) };
    }
  }

  return { kind: "needs_scheme", factType };
}

function citationsFor(rows: FactRow[]): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const r of rows) {
    if (seen.has(r.source_id)) continue;
    seen.add(r.source_id);
    const c = toCitation(r.source_id);
    if (c) out.push(c);
  }
  return out;
}

function planLabel(plan: Plan | null): string {
  return plan === "direct" ? "Direct plan" : plan === "regular" ? "Regular plan" : "";
}

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function phrase(factType: FactType, scheme: string, plan: Plan | null, rows: FactRow[]): string {
  const name = SCHEME_DISPLAY[scheme] ?? scheme;
  const r = rows[0];
  const eff = formatDate(r.source_effective_date);
  switch (factType) {
    case "expense_ratio":
      return `The expense ratio of ${name} (${planLabel(plan)}) is ${r.value}${r.qualifier ? `, ${r.qualifier}` : ""}${
        eff ? `, as stated in the TER disclosure dated ${eff}` : ""
      }.`;
    case "exit_load":
      if (rows.length === 1) {
        return `The exit load for ${name} is ${r.value}${r.qualifier ? ` ${r.qualifier}` : ""}.`;
      }
      return `The exit load for ${name} is graded by holding period: ${rows.map((x) => `${x.value} ${x.qualifier ?? ""}`.trim()).join("; ")}.`;
    case "lock_in":
      return r.value.toLowerCase() === "none"
        ? `${name} has no lock-in period.`
        : `${name} has a lock-in period of ${r.value}.`;
    case "min_sip":
      return `The minimum SIP amount for ${name} is ${r.value}.`;
    case "min_lumpsum":
      return `The minimum lumpsum investment for ${name} is ${r.value}.`;
    case "benchmark":
      return `The benchmark for ${name} is ${r.value}${r.qualifier ? ` (${r.qualifier.replace(/^Additional benchmark: /, "additional benchmark: ")})` : ""}.`;
    case "riskometer":
      return `${name} is rated "${r.value}" on the riskometer${eff ? `, as of ${eff}` : ""}.`;
    case "fund_manager":
      return `${name} is managed by ${joinNames(rows.map((x) => x.value))}.`;
    case "category":
      return `${name} is categorised as ${r.value}.`;
  }
}

function phraseAllSchemes(factType: FactType, rows: FactRow[]): string {
  const byValue = new Map<string, string[]>();
  for (const r of rows) {
    const key = factType === "lock_in" && r.value.toLowerCase() === "none" ? "None" : r.value;
    byValue.set(key, [...(byValue.get(key) ?? []), SCHEME_DISPLAY[r.scheme] ?? r.scheme]);
  }
  const label: Record<string, string> = {
    lock_in: "lock-in period",
    min_sip: "minimum SIP amount",
    min_lumpsum: "minimum lumpsum investment",
    benchmark: "benchmark",
    riskometer: "riskometer rating",
    category: "category",
    exit_load: "exit load",
    fund_manager: "fund manager",
    expense_ratio: "expense ratio",
  };
  if (byValue.size === 1) {
    const [value] = byValue.keys();
    return `The ${label[factType]} is ${value} for all four schemes (${joinNames(Object.values(SCHEME_DISPLAY))}).`;
  }
  const parts = [...byValue.entries()].map(([value, schemes]) => {
    if (factType === "lock_in") {
      return value === "None"
        ? `${joinNames(schemes)} ${schemes.length > 1 ? "have" : "has"} no lock-in`
        : `${joinNames(schemes)} ${schemes.length > 1 ? "have" : "has"} a lock-in of ${value}`;
    }
    return `${joinNames(schemes)}: ${value}`;
  });
  const eff = factType === "riskometer" ? formatDate(rows[0].source_effective_date) : null;
  return `${capitalize(label[factType])}${factType === "lock_in" ? "" : " by scheme"} — ${parts.join("; ")}${eff ? ` (as of ${eff})` : ""}.`;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
