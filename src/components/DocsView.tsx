import React, { useState } from "react";

export function DocsView() {
  const [docTab, setDocTab] = useState<"readme" | "disclaimer" | "qa" | "rules">("readme");

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1815]">Project Deliverables & Documentation</h2>
          <p className="mt-1 text-sm text-[#6c655d]">
            Complete documentation artifacts required for the Mutual Fund FAQs (Facts-Only Q&A) submission.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setDocTab("readme")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              docTab === "readme" ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
            }`}
          >
            README.md
          </button>
          <button
            onClick={() => setDocTab("disclaimer")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              docTab === "disclaimer" ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
            }`}
          >
            DISCLAIMER.md
          </button>
          <button
            onClick={() => setDocTab("qa")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              docTab === "qa" ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
            }`}
          >
            SAMPLE_QA.md
          </button>
          <button
            onClick={() => setDocTab("rules")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              docTab === "rules" ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
            }`}
          >
            CLAUDE.md Rules
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e3db] bg-white p-6 shadow-xs prose prose-stone max-w-none text-sm leading-relaxed text-[#1a1815]">
        {docTab === "readme" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1a1815]">About Groww Assist</h3>
            <p>
              <strong>Groww Asset Management Limited is a SEBI-registered mutual fund (Reg. MF/068//11/03) and an AMFI-registered mutual fund distributor. It is not a SEBI-registered Investment Adviser.</strong> A distributor may explain facts; it may not recommend. This assistant therefore answers factual questions about four Groww Mutual Fund schemes using only official sources, cites a link on every answer, and politely refuses anything amounting to advice. The refusal path is a feature of the product, not an error case.
            </p>
            <h4 className="font-semibold text-base mt-4 text-[#1a1815]">Scope: Four Schemes</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Groww Large Cap Fund</strong> — Baseline active equity; ordinary case everything else is measured against.</li>
              <li><strong>Groww ELSS Tax Saver Fund</strong> — 3-year statutory lock-in, nil exit load. Tests that a fact which exists for one scheme and not others is handled cleanly without hallucination.</li>
              <li><strong>Groww Nifty Total Market Index Fund</strong> — Passive index fund; 0.25% exit load within 7 days. Tests the low end of the number range.</li>
              <li><strong>Groww Liquid Fund</strong> — Debt fund with a <em>graded, day-wise exit load</em> across the first 6 days. Tests multi-tier schedules.</li>
            </ul>
            <h4 className="font-semibold text-base mt-4 text-[#1a1815]">Authoritative Sources</h4>
            <p>
              Sources are <strong>growwmf.in only — never groww.in</strong>. Two different entities: <code>growwmf.in</code> is Groww Asset Management Limited, the fund house and primary source; <code>groww.in</code> is the brokerage app and distributor surface. AMFI and KFintech official portals are also included.
            </p>
          </div>
        )}

        {docTab === "disclaimer" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1a1815]">Official Disclaimers</h3>
            <div className="rounded-xl border border-[#a6521e]/30 bg-[#fdf4ee] p-4 text-[#7d3d16]">
              <p className="font-bold text-xs uppercase tracking-wider">Persistent Header Badge:</p>
              <p className="mt-1 text-base font-semibold">Facts only · No investment advice</p>
            </div>
            <div className="rounded-xl border border-[#e8e3db] bg-[#fbfaf8] p-4">
              <p className="font-bold text-xs uppercase tracking-wider text-[#6c655d]">Footer Legal Notice:</p>
              <p className="mt-1 text-sm text-[#1a1815]">
                Groww is a SEBI-registered broker and an AMFI-registered mutual fund distributor, not a SEBI-registered Investment Adviser. This assistant explains what official scheme documents say. It does not recommend investments, and it does not calculate returns.
              </p>
              <p className="mt-2 text-xs text-[#6c655d]">Last updated from sources: 21 September 2026 IST · corpus 2026-09-21-a963e690</p>
            </div>
            <div className="rounded-xl border border-[#e8e3db] bg-[#fbfaf8] p-4">
              <p className="font-bold text-xs uppercase tracking-wider text-[#6c655d]">Machine-Readable API Response Invariant:</p>
              <pre className="mt-1 bg-white p-2.5 rounded border border-[#e8e3db] text-xs font-mono">
                {JSON.stringify({ disclaimer: "Facts only. No investment advice." }, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {docTab === "qa" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1a1815]">Sample Q&A Pairs (Verbatim from Production)</h3>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e8e3db] p-4 bg-[#fbfaf8]">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">1. Fact — Large Cap TER</span>
                <p className="font-semibold text-sm mt-2 text-[#1a1815]">Q: What is the expense ratio of Groww Large Cap Fund direct plan?</p>
                <p className="mt-1 text-xs text-[#6c655d]">A: The expense ratio of Groww Large Cap Fund (Direct plan) is 1.69%, as stated in the TER disclosure dated 20 September 2026.</p>
                <p className="mt-1.5 text-[11px] text-[#a6521e]">Citation: Total Expense Ratio Disclosure — 20 Sep 2026 (growwmf.in/downloads/expense-ratio)</p>
              </div>

              <div className="rounded-xl border border-[#e8e3db] p-4 bg-[#fbfaf8]">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">2. Fact — Liquid Graded Exit Load</span>
                <p className="font-semibold text-sm mt-2 text-[#1a1815]">Q: What is the exit load on Groww Liquid Fund?</p>
                <p className="mt-1 text-xs text-[#6c655d]">A: The exit load for Groww Liquid Fund is graded by holding period: 0.007% if exited within 0 to 1 days from the purchase NAV date; 0.0065% within 2 days; 0.006% within 3 days; 0.0055% within 4 days; 0.005% within 5 days; 0.0045% within 6 days; Nil after 7 Days.</p>
                <p className="mt-1.5 text-[11px] text-[#a6521e]">Citation: Groww Liquid Fund Direct Growth (growwmf.in)</p>
              </div>

              <div className="rounded-xl border border-[#a6521e]/25 p-4 bg-[#fdf4ee]">
                <span className="text-[10px] font-mono uppercase bg-[#a6521e]/15 text-[#7d3d16] px-2 py-0.5 rounded font-bold">3. Advice Refusal</span>
                <p className="font-semibold text-sm mt-2 text-[#1a1815]">Q: Should I invest in Groww ELSS Tax Saver Fund?</p>
                <p className="mt-1 text-xs text-[#1a1815]">A: I can explain what the official documents say about these schemes, but I can't tell you whether to invest — Groww is a distributor, not a SEBI-registered investment adviser. For unbiased help with that decision, AMFI's investor education resources are a good starting point.</p>
                <p className="mt-1.5 text-[11px] text-[#a6521e]">Educational Link: https://www.amfiindia.com/investor</p>
              </div>

              <div className="rounded-xl border border-amber-300 p-4 bg-amber-50">
                <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">4. PII Guard Refusal</span>
                <p className="font-semibold text-sm mt-2 text-[#1a1815]">Q: My PAN is ABCDE1234F, what is my balance?</p>
                <p className="mt-1 text-xs text-[#1a1815]">A: I can't work with messages that contain personal identifiers such as a PAN, Aadhaar, phone number, email, folio or account number, and I don't have access to your holdings. Please remove those details and ask again.</p>
              </div>
            </div>
          </div>
        )}

        {docTab === "rules" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1a1815]">Binding Implementation Rules (N1–N10)</h3>
            <ul className="space-y-3 text-xs">
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N1 — Context-Aware PII Detection:</strong> Bare 4-6 digit runs (e.g. ₹500, 2026, 7 days) are NEVER flagged. PAN and email are flagged standalone. 10-12 digit runs are flagged unless preceded by currency markers (₹, Rs, INR).
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N2 — plan is nullable in Fact Table:</strong> Only <code>expense_ratio</code> differs between Direct and Regular. All other facts (exit load, lock-in, min sip, riskometer, benchmark) have <code>plan: null</code>. Disambiguation fires ONLY for varies_by_plan: true.
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N3 — Explicit Miss Path:</strong> If fact lookup finds no matching row, it falls through to Path 2 RAG. If RAG is below score floor, it falls through to Path 3 refusal. Never pass undefined.
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N4 — citations is an array:</strong> Always an array, never a single object or string.
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N5 — Model Never Emits a URL:</strong> The model only ever emits <code>source_id</code>. The application maps ID to URL from the official registry.
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N8 — Retrieval Order:</strong> BM25 + embedding hits unioned and deduplicated, then reranked, then SCORE_FLOOR applied after rerank.
              </li>
              <li className="p-3 bg-[#fbfaf8] border border-[#e8e3db] rounded-lg">
                <strong>N10 — Retrieved Text is Data:</strong> Every retrieved chunk is wrapped in XML tags and treated strictly as reference data, never as prompt instructions.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
