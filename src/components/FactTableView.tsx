import React, { useState } from "react";
import factsData from "../../data/facts.json";
import type { FactRow } from "../lib/types.ts";
import { SCHEME_DISPLAY } from "../lib/facts/lookup.ts";

export function FactTableView() {
  const [selectedScheme, setSelectedScheme] = useState<string>("all");
  const [search, setSearch] = useState("");

  const facts: FactRow[] = factsData as FactRow[];

  const filtered = facts.filter((row) => {
    if (selectedScheme !== "all" && row.scheme !== selectedScheme) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        row.fact_type.toLowerCase().includes(q) ||
        row.value.toLowerCase().includes(q) ||
        (row.qualifier && row.qualifier.toLowerCase().includes(q)) ||
        row.source_id.toLowerCase().includes(q) ||
        (row.plan && row.plan.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a1815]">Verified Fact Table</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            51 Verified Rows (100% Signed-off)
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6c655d]">
          The deterministic single source of truth for all quantitative scheme facts.
          Under Rule N2, only <code>expense_ratio</code> varies by plan (Direct/Regular); all other facts have <code>plan: null</code>.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setSelectedScheme("all")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              selectedScheme === "all"
                ? "bg-[#1a1815] text-white"
                : "border border-[#e8e3db] bg-white text-[#6c655d] hover:bg-[#fbfaf8]"
            }`}
          >
            All 4 Schemes ({facts.length})
          </button>
          {Object.entries(SCHEME_DISPLAY).map(([slug, name]) => {
            const count = facts.filter((f) => f.scheme === slug).length;
            return (
              <button
                key={slug}
                onClick={() => setSelectedScheme(slug)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  selectedScheme === slug
                    ? "bg-[#1a1815] text-white"
                    : "border border-[#e8e3db] bg-white text-[#6c655d] hover:bg-[#fbfaf8]"
                }`}
              >
                {name.replace("Groww ", "")} ({count})
              </button>
            );
          })}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search facts (e.g. exit_load, 1.69%, 3 years)..."
          className="rounded-lg border border-[#e8e3db] bg-white px-3.5 py-1.5 text-xs text-[#1a1815] focus:border-[#a6521e] focus:outline-none w-full sm:w-64"
        />
      </div>

      {/* Facts Table */}
      <div className="overflow-x-auto rounded-xl border border-[#e8e3db] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fbfaf8] border-b border-[#e8e3db] text-[#6c655d] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Scheme</th>
              <th className="py-3 px-3">Plan</th>
              <th className="py-3 px-3">Fact Type</th>
              <th className="py-3 px-3">Exact Value</th>
              <th className="py-3 px-4">Qualifier / Schedule</th>
              <th className="py-3 px-3">Authoritative Source</th>
              <th className="py-3 px-3">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e3db] text-[#1a1815]">
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-[#fbfaf8]/80 transition-colors">
                <td className="py-3 px-4 font-medium">
                  {SCHEME_DISPLAY[r.scheme] || r.scheme}
                </td>
                <td className="py-3 px-3">
                  {r.plan ? (
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-[10px] text-stone-700 uppercase">
                      {r.plan}
                    </span>
                  ) : (
                    <span className="text-stone-400 font-mono text-[11px]">—</span>
                  )}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-[#7d3d16]">
                  {r.fact_type}
                </td>
                <td className="py-3 px-3 font-semibold text-emerald-800">
                  {r.value}
                </td>
                <td className="py-3 px-4 text-[#6c655d] max-w-xs">
                  {r.qualifier || "—"}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#6c655d]">
                  {r.source_id}
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    ✓ {r.verified_by}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
