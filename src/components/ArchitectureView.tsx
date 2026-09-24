import React, { useState } from "react";
import { processQuestion } from "../lib/pipeline.ts";
import type { AskResponse } from "../lib/types.ts";

export function ArchitectureView() {
  const [testQuery, setTestQuery] = useState("What is the expense ratio of Groww Large Cap Fund direct plan?");
  const [result, setResult] = useState<AskResponse>(() => processQuestion(testQuery));

  function handleTest(q: string) {
    setTestQuery(q);
    setResult(processQuestion(q));
  }

  return (
    <div className="space-y-8 py-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a1815]">3-Path Production Architecture</h2>
        <p className="mt-1 text-sm text-[#6c655d]">
          Financial numbers come from human-verified tables, never from probabilistic generative models.
          RAG is reserved exclusively for explanatory prose.
        </p>
      </div>

      {/* 3 Paths Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Path 1 */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Path 1 · Fact Table
              </span>
              <span className="rounded bg-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                Deterministic
              </span>
            </div>
            <h3 className="font-semibold text-emerald-950 text-sm">Verified Scheme Facts</h3>
            <p className="mt-2 text-xs text-emerald-900/80 leading-relaxed">
              Handles expense ratios (TER), exit loads, lock-ins, min SIPs, benchmarks, riskometer ratings, and fund managers.
              Read from <code>data/facts.json</code> verified against SEBI/AMC filings.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-800">
            ✓ 0% Hallucination · Exact values · Explicit miss path
          </div>
        </div>

        {/* Path 2 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-blue-800 uppercase tracking-wider">
                Path 2 · Hybrid RAG
              </span>
              <span className="rounded bg-blue-200/60 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                BM25 + Rerank
              </span>
            </div>
            <h3 className="font-semibold text-blue-950 text-sm">Grounded Prose Explanations</h3>
            <p className="mt-2 text-xs text-blue-900/80 leading-relaxed">
              Handles explanations, processes, and regulatory definitions (e.g. ELSS lock-in mechanics, CAS statements, KFintech capital gains).
              Strict score floor (0.50) + ≤3 sentences + N5 citation validator.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-200/80 text-[11px] text-blue-800">
            ✓ Strict score floor · Model never emits URLs
          </div>
        </div>

        {/* Path 3 */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-amber-800 uppercase tracking-wider">
                Path 3 · Refusals
              </span>
              <span className="rounded bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                Feature, Not Error
              </span>
            </div>
            <h3 className="font-semibold text-amber-950 text-sm">Regulatory Boundaries</h3>
            <p className="mt-2 text-xs text-amber-900/80 leading-relaxed">
              Refuses investment advice ("Should I buy?"), returns forecasts ("Which gave better returns?"),
              portfolio consultations, PII violations, and out-of-scope schemes. Links to AMFI / factsheet.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/80 text-[11px] text-amber-800">
            ✓ AMFI distributor compliance · PII protection
          </div>
        </div>
      </div>

      {/* Interactive System Pipeline Inspector */}
      <div className="rounded-2xl border border-[#e8e3db] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-base text-[#1a1815]">Interactive System Pipeline Inspector</h3>
        <p className="mt-1 text-xs text-[#6c655d]">
          Test any input query to inspect live decision logs across the guards, scope classifier, router, and path resolution.
        </p>

        {/* Test Preset Chips */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-xs font-medium text-[#6c655d] self-center mr-1">Presets:</span>
          <button
            onClick={() => handleTest("What is the expense ratio of Groww Large Cap Fund direct plan?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 1: Expense ratio
          </button>
          <button
            onClick={() => handleTest("What is an ELSS lock-in?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 2: ELSS definition
          </button>
          <button
            onClick={() => handleTest("Should I invest in Groww ELSS Tax Saver Fund?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 3: Advice refusal
          </button>
          <button
            onClick={() => handleTest("My PAN is ABCDE1234F, what is my balance?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 3: PII Guard
          </button>
          <button
            onClick={() => handleTest("What is the expense ratio of HDFC Flexi Cap Fund?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 3: Out-of-scope AMC
          </button>
          <button
            onClick={() => handleTest("When was the battle of Panipat?")}
            className="rounded-md border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs hover:border-[#a6521e]"
          >
            Path 3: Low confidence
          </button>
        </div>

        {/* Input bar */}
        <div className="mt-4 flex gap-2">
          <input
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 rounded-lg border border-[#e8e3db] px-3.5 py-2 text-sm text-[#1a1815] focus:border-[#a6521e] focus:outline-none"
            placeholder="Type any test query..."
          />
          <button
            onClick={() => handleTest(testQuery)}
            className="rounded-lg bg-[#1a1815] px-4 py-2 text-xs font-semibold text-white hover:bg-black"
          >
            Trace Execution
          </button>
        </div>

        {/* Trace Output */}
        {result.trace && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[#6c655d] block text-[10px] uppercase">PII Guard (N1)</span>
                <span className={`font-bold mt-1 block ${result.trace.piiGuard.flagged ? "text-red-700" : "text-emerald-700"}`}>
                  {result.trace.piiGuard.flagged ? `BLOCKED (${result.trace.piiGuard.kind})` : "PASSED (Clean)"}
                </span>
              </div>
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[#6c655d] block text-[10px] uppercase">Scope Check</span>
                <span className={`font-bold mt-1 block ${result.trace.scopeCheck.scope === "in_scope" || result.trace.scopeCheck.scope === "none" ? "text-emerald-700" : "text-amber-700"}`}>
                  {result.trace.scopeCheck.scope}
                </span>
              </div>
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[#6c655d] block text-[10px] uppercase">Router Intent</span>
                <span className="font-bold text-[#1a1815] mt-1 block">
                  {result.trace.router.intent}
                </span>
              </div>
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[#6c655d] block text-[10px] uppercase">Path Chosen</span>
                <span className="font-bold text-[#a6521e] mt-1 block">
                  {result.trace.pathTaken}
                </span>
              </div>
            </div>

            {/* Answer Display */}
            <div className="rounded-xl border border-[#e8e3db] bg-[#fbfaf8] p-4 text-sm">
              <div className="flex items-center justify-between text-xs text-[#6c655d] mb-1.5 font-mono">
                <span>Output [answerType: {result.answerType}]</span>
                <span>Latency: {result.trace.ms} ms</span>
              </div>
              <p className="text-[#1a1815] leading-relaxed">{result.answer}</p>
              {result.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#e8e3db] text-xs">
                  <span className="font-semibold text-[#6c655d]">Attached Citation:</span>{" "}
                  <a
                    href={result.citations[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#a6521e] underline"
                  >
                    {result.citations[0].title}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
