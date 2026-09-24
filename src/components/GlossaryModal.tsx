import React, { useState } from "react";
import { FINANCIAL_GLOSSARY } from "../lib/glossary.ts";

export function GlossaryView() {
  const [search, setSearch] = useState("");
  const terms = Object.values(FINANCIAL_GLOSSARY);

  const filtered = terms.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.term.toLowerCase().includes(q) ||
      t.shortDef.toLowerCase().includes(q) ||
      t.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1815]">Mutual Fund Jargon Buster</h2>
          <p className="mt-1 text-sm text-[#6c655d]">
            Official regulatory definitions from SEBI circulars, AMFI guidance, and AMC compliance disclosures.
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search glossary (e.g. TER, lock-in, CAS)..."
          className="rounded-lg border border-[#e8e3db] bg-white px-3.5 py-1.5 text-xs text-[#1a1815] focus:border-[#a6521e] focus:outline-none w-full sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div
            key={t.term}
            className="rounded-xl border border-[#e8e3db] bg-white p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="font-semibold text-sm text-[#1a1815] block">
                {t.term}
              </span>
              <p className="mt-2 text-xs font-medium text-emerald-900 bg-emerald-50/70 p-2 rounded border border-emerald-100 leading-relaxed">
                {t.shortDef}
              </p>
              <p className="mt-2 text-xs text-[#6c655d] leading-relaxed">
                {t.details}
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-[#e8e3db] text-[11px] font-mono text-stone-500">
              Authority: {t.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
