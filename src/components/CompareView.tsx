import React, { useState } from "react";
import factsData from "../../data/facts.json";
import { SCHEME_DISPLAY } from "../lib/facts/lookup.ts";
import type { FactRow } from "../lib/types.ts";

export function CompareView() {
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([
    "groww-large-cap",
    "groww-elss-tax-saver",
    "groww-nifty-total-market-index",
    "groww-liquid",
  ]);

  const facts: FactRow[] = factsData as FactRow[];

  function toggleScheme(slug: string) {
    if (selectedSchemes.includes(slug)) {
      if (selectedSchemes.length > 1) {
        setSelectedSchemes(selectedSchemes.filter((s) => s !== slug));
      }
    } else {
      setSelectedSchemes([...selectedSchemes, slug]);
    }
  }

  function getFactValue(scheme: string, factType: string, plan: string | null = null): string {
    const rows = facts.filter(
      (r) => r.scheme === scheme && r.fact_type === factType && (plan === null ? true : r.plan === plan)
    );
    if (rows.length === 0) return "—";
    if (rows.length === 1) {
      const r = rows[0];
      return r.qualifier ? `${r.value} (${r.qualifier})` : r.value;
    }
    return rows.map((r) => `${r.value} ${r.qualifier ?? ""}`.trim()).join("; ");
  }

  const ATTRIBUTES = [
    { label: "Category", factType: "category", plan: null },
    { label: "Expense Ratio (Direct Plan)", factType: "expense_ratio", plan: "direct" },
    { label: "Expense Ratio (Regular Plan)", factType: "expense_ratio", plan: "regular" },
    { label: "Exit Load", factType: "exit_load", plan: null },
    { label: "Lock-in Period", factType: "lock_in", plan: null },
    { label: "Minimum SIP", factType: "min_sip", plan: null },
    { label: "Minimum Lumpsum", factType: "min_lumpsum", plan: null },
    { label: "Riskometer Rating", factType: "riskometer", plan: null },
    { label: "Benchmark Index", factType: "benchmark", plan: null },
    { label: "Fund Manager", factType: "fund_manager", plan: null },
  ];

  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a1815]">Facts-Only Scheme Comparator</h2>
          <span className="rounded-full bg-[#fdf4ee] border border-[#a6521e]/30 px-3 py-1 text-xs font-semibold text-[#7d3d16]">
            Strictly Factual · No Advice
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6c655d]">
          Direct side-by-side comparison of official parameters across Groww Mutual Fund schemes.
          Every row is verified against the fund house's SIDs and monthly disclosures.
        </p>
      </div>

      {/* Scheme Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#6c655d] mr-1">Compare schemes:</span>
        {Object.entries(SCHEME_DISPLAY).map(([slug, name]) => {
          const isSelected = selectedSchemes.includes(slug);
          return (
            <button
              key={slug}
              onClick={() => toggleScheme(slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-[#1a1815] text-white"
                  : "border border-[#e8e3db] bg-white text-[#6c655d] hover:bg-[#fbfaf8]"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {name.replace("Groww ", "")}
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix */}
      <div className="overflow-x-auto rounded-xl border border-[#e8e3db] bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#fbfaf8] border-b border-[#e8e3db] text-[#6c655d] text-[10px] uppercase font-bold tracking-wider">
              <th className="py-3 px-4 w-44 sticky left-0 bg-[#fbfaf8] z-10 border-r border-[#e8e3db]">
                Scheme Feature
              </th>
              {selectedSchemes.map((slug) => (
                <th key={slug} className="py-3 px-4 min-w-[200px] border-r border-[#e8e3db] text-[#1a1815] font-semibold text-xs normal-case">
                  {SCHEME_DISPLAY[slug]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e3db] text-[#1a1815]">
            {ATTRIBUTES.map((attr, idx) => (
              <tr key={attr.label} className={idx % 2 === 0 ? "bg-white" : "bg-[#fbfaf8]/50"}>
                <td className="py-3 px-4 font-semibold text-[#6c655d] text-[11px] sticky left-0 bg-inherit z-10 border-r border-[#e8e3db]">
                  {attr.label}
                </td>
                {selectedSchemes.map((slug) => {
                  const val = getFactValue(slug, attr.factType, attr.plan);
                  const isHighlight =
                    (attr.factType === "lock_in" && val !== "—" && val.toLowerCase() !== "none") ||
                    (attr.factType === "expense_ratio" && attr.plan === "direct");

                  return (
                    <td
                      key={slug}
                      className={`py-3 px-4 border-r border-[#e8e3db] ${
                        isHighlight ? "font-semibold text-emerald-800" : ""
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[#e8e3db] bg-[#fbfaf8] p-4 text-xs text-[#6c655d] space-y-1">
        <p className="font-semibold text-[#1a1815]">Compliance Notice:</p>
        <p>
          This comparison matrix is strictly factual and descriptive. Groww Asset Management Limited and Groww Invest Tech
          do not offer advisory opinions or suitability evaluations in this table. Past performance is neither stated nor implied.
        </p>
      </div>
    </div>
  );
}
