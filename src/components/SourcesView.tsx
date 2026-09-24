import React, { useState } from "react";
import { SOURCE_REGISTRY_DATA } from "../lib/sources/registry.ts";
import type { SourceRow } from "../lib/types.ts";

export function SourcesView() {
  const [docFilter, setDocFilter] = useState<string>("all");
  const sources: SourceRow[] = SOURCE_REGISTRY_DATA;

  const docTypes = Array.from(new Set(sources.map((s) => s.doc_type))).sort();

  const filtered = sources.filter((s) => {
    if (docFilter !== "all" && s.doc_type !== docFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a1815]">Official Sources Registry</h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            23 Verified Public Pages
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6c655d]">
          Sourced strictly from <strong>growwmf.in</strong> (Groww Asset Management Limited), <strong>AMFI</strong>, and <strong>KFin Technologies</strong> (RTA).
          Never from third-party blogs or brokers.
        </p>
      </div>

      {/* Filter by Doc Type */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => setDocFilter("all")}
          className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
            docFilter === "all"
              ? "bg-[#1a1815] text-white"
              : "border border-[#e8e3db] bg-white text-[#6c655d] hover:bg-[#fbfaf8]"
          }`}
        >
          All Document Types ({sources.length})
        </button>
        {docTypes.map((dt) => (
          <button
            key={dt}
            onClick={() => setDocFilter(dt)}
            className={`rounded-lg px-3 py-1.5 font-medium font-mono text-[11px] transition-colors ${
              docFilter === dt
                ? "bg-[#1a1815] text-white"
                : "border border-[#e8e3db] bg-white text-[#6c655d] hover:bg-[#fbfaf8]"
            }`}
          >
            {dt} ({sources.filter((s) => s.doc_type === dt).length})
          </button>
        ))}
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-[#e8e3db] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#a6521e]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] text-[#6c655d] bg-stone-100 px-2 py-0.5 rounded">
                  {s.id}
                </span>
                <span className="font-mono text-[10px] text-[#7d3d16] bg-[#fdf4ee] px-2 py-0.5 rounded border border-[#a6521e]/20">
                  {s.doc_type}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#1a1815] leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-xs text-[#6c655d]">
                <strong>Publisher:</strong> {s.publisher}
              </p>
              {s.scheme && (
                <p className="text-xs text-[#6c655d]">
                  <strong>Scheme:</strong> {s.scheme} {s.plan ? `(${s.plan})` : ""}
                </p>
              )}
              <p className="text-xs text-[#6c655d]">
                <strong>Effective Date:</strong>{" "}
                {s.source_effective_date || `(Live Page — fetched ${s.fetched_at})`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e8e3db] flex items-center justify-between text-xs">
              <span className="text-[#6c655d] truncate max-w-[240px] font-mono text-[10px]">
                {s.landing_url}
              </span>
              <a
                href={s.landing_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#a6521e] hover:underline shrink-0"
              >
                Visit Page ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
