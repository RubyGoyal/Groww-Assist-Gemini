import React from "react";
import { ArrowUpRight, ShieldCheck, Tag, Percent, Lock, Timer } from "lucide-react";

interface SchemeCardsProps {
  onAsk: (question: string) => void;
}

const SCHEMES_INFO = [
  {
    slug: "groww-large-cap",
    name: "Groww Large Cap Fund",
    category: "Equity: Large Cap",
    riskometer: "Very High",
    riskometerColor: "bg-red-100 text-red-800 border-red-200",
    directTer: "1.69%",
    exitLoad: "1.00% if ≤ 30 days",
    lockIn: "None",
    quickPrompt: "What is the expense ratio of Groww Large Cap Fund direct plan?",
  },
  {
    slug: "groww-elss-tax-saver",
    name: "Groww ELSS Tax Saver Fund",
    category: "Equity: ELSS (Tax Saver)",
    riskometer: "Very High",
    riskometerColor: "bg-red-100 text-red-800 border-red-200",
    directTer: "1.07%",
    exitLoad: "Nil",
    lockIn: "3 Years mandatory",
    quickPrompt: "What is the lock-in period for Groww ELSS Tax Saver Fund?",
  },
  {
    slug: "groww-nifty-total-market-index",
    name: "Groww Nifty Total Market Index",
    category: "Index Fund: Broad Market",
    riskometer: "Very High",
    riskometerColor: "bg-red-100 text-red-800 border-red-200",
    directTer: "0.26%",
    exitLoad: "0.25% if ≤ 7 days",
    lockIn: "None",
    quickPrompt: "What index does Groww Nifty Total Market Index Fund track?",
  },
  {
    slug: "groww-liquid",
    name: "Groww Liquid Fund",
    category: "Debt: Liquid Scheme",
    riskometer: "Low to Moderate",
    riskometerColor: "bg-amber-100 text-amber-800 border-amber-200",
    directTer: "0.25%",
    exitLoad: "7-day graded schedule",
    lockIn: "None",
    quickPrompt: "What is the exit load on Groww Liquid Fund?",
  },
];

export function SchemeCards({ onAsk }: SchemeCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {SCHEMES_INFO.map((s) => (
        <div
          key={s.slug}
          className="group rounded-xl border border-[#e8e3db] bg-white p-4 shadow-xs transition-all hover:border-[#a6521e]/50 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-1 mb-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${s.riskometerColor}`}>
                {s.riskometer} Risk
              </span>
              <span className="text-[10px] font-mono text-[#6c655d] uppercase">{s.category.split(":")[0]}</span>
            </div>

            <h3 className="font-bold text-sm text-[#1a1815] group-hover:text-[#a6521e] transition-colors leading-snug">
              {s.name}
            </h3>
            <p className="text-[11px] text-[#6c655d] mt-0.5">{s.category}</p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-[#e8e3db]/60 pt-2.5 font-mono">
              <div>
                <span className="text-[10px] text-[#6c655d] block">Direct TER</span>
                <span className="font-semibold text-emerald-800">{s.directTer}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6c655d] block">Lock-in</span>
                <span className={`font-semibold ${s.lockIn !== "None" ? "text-amber-800" : "text-[#1a1815]"}`}>
                  {s.lockIn}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAsk(s.quickPrompt)}
            className="mt-3 flex items-center justify-between rounded-lg bg-[#fbfaf8] border border-[#e8e3db] px-2.5 py-1.5 text-[11px] font-medium text-[#7d3d16] hover:bg-[#fdf4ee] hover:border-[#a6521e]/40 transition-colors"
          >
            <span>Ask Quick Fact</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
