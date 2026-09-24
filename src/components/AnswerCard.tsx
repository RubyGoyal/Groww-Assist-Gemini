import React, { useState } from "react";
import type { AskResponse, Citation } from "../lib/types.ts";
import { FINANCIAL_GLOSSARY, type GlossaryTerm } from "../lib/glossary.ts";

function CitationItem({ citation }: { citation: Citation }) {
  return (
    <li className="rounded-lg border border-[#e8e3db] bg-white p-3.5 transition-colors hover:border-[#a6521e]/40">
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[14px] font-medium text-[#1a1815] underline decoration-[#e8e3db] underline-offset-4 hover:decoration-[#a6521e]"
      >
        {citation.title} ↗
      </a>
      <div className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <span className="text-[#6c655d]">Publisher:</span>
        <span className="text-[#1a1815] font-medium">{citation.publisher}</span>
        <span className="text-[#6c655d]">Doc Type:</span>
        <span className="font-mono text-[#1a1815]">{citation.docType}</span>
        <span className="text-[#6c655d]">Effective:</span>
        <span className="text-[#1a1815]">
          {citation.sourceEffectiveDate || `Live page (retrieved ${citation.retrievedAt})`}
        </span>
      </div>
    </li>
  );
}

function CitationsList({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="mt-4 pt-3 border-t border-[#e8e3db]/70">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6c655d]">
        {citations.length === 1 ? "Verified Source Link" : "Verified Sources Links"}
      </p>
      <ul className="mt-2 space-y-2">
        {citations.map((c, i) => (
          <CitationItem key={`${c.url}-${i}`} citation={c} />
        ))}
      </ul>
    </div>
  );
}

function JargonChips({ text }: { text: string }) {
  const [activeDef, setActiveDef] = useState<GlossaryTerm | null>(null);

  const matchedTerms = Object.values(FINANCIAL_GLOSSARY).filter((g) => {
    const key = g.term.toLowerCase();
    const shortKey = g.term.split(" ")[0].toLowerCase();
    return text.toLowerCase().includes(shortKey) || text.toLowerCase().includes(key);
  });

  if (matchedTerms.length === 0) return null;

  return (
    <div className="mt-3 pt-2 text-xs">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase font-bold text-[#6c655d]">Key Terms:</span>
        {matchedTerms.map((m) => (
          <button
            key={m.term}
            type="button"
            onClick={() => setActiveDef(activeDef?.term === m.term ? null : m)}
            className="rounded border border-[#e8e3db] bg-[#fbfaf8] px-2 py-0.5 text-[11px] text-[#7d3d16] hover:border-[#a6521e]/50 font-medium"
          >
            {m.term.split("(")[0].trim()} ℹ️
          </button>
        ))}
      </div>

      {activeDef && (
        <div className="mt-2 rounded-lg border border-[#a6521e]/20 bg-[#fdf4ee] p-3 text-xs text-[#1a1815]">
          <div className="flex items-center justify-between font-bold text-[#7d3d16]">
            <span>{activeDef.term}</span>
            <button onClick={() => setActiveDef(null)} className="text-stone-400 hover:text-stone-700">✕</button>
          </div>
          <p className="mt-1 font-medium text-stone-800">{activeDef.shortDef}</p>
          <p className="mt-1 text-[11px] text-[#6c655d] leading-relaxed">{activeDef.details}</p>
          <p className="mt-1.5 text-[10px] text-stone-500 font-mono">Source: {activeDef.source}</p>
        </div>
      )}
    </div>
  );
}

export function AnswerCard({
  response,
  onAsk,
}: {
  response: AskResponse;
  onAsk: (question: string) => void;
}) {
  const [showTrace, setShowTrace] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    let copyText = `${response.answer}\n\nDisclaimer: ${response.disclaimer}`;
    if (response.citations && response.citations.length > 0) {
      copyText += `\n\nVerified Sources:\n` + response.citations.map((c) => `- ${c.title}: ${c.url}`).join("\n");
    }
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // 1. Refusals: advice / portfolio
  if (response.answerType === "advice_refusal") {
    return (
      <div className="rounded-xl border border-[#a6521e]/25 bg-[#fdf4ee] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d3d16]">
            Regulatory Boundary · Not Something I Can Advise On
          </p>
          <span className="rounded bg-[#a6521e]/15 px-2 py-0.5 text-[10px] font-medium text-[#7d3d16]">
            Refusal
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-[1.65] text-[#1a1815]">{response.answer}</p>
        {response.educationalLink && (
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={response.educationalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#a6521e] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#7d3d16] transition-colors"
            >
              Learn more at AMFI Investor Portal ↗
            </a>
          </div>
        )}
        <TraceToggle trace={response.trace} showTrace={showTrace} setShowTrace={setShowTrace} />
      </div>
    );
  }

  // 2. Refusals: PII
  if (response.answerType === "pii_refusal") {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">
            Privacy Guard Active · Personal Identifier Detected
          </p>
          <span className="rounded bg-amber-200/60 px-2 py-0.5 text-[10px] font-medium text-amber-900">
            PII Blocked
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-[1.65] text-[#1a1815]">{response.answer}</p>
        <p className="mt-2 text-xs text-amber-700">
          Rule N1: We do not accept or store PAN, Aadhaar, folio numbers, phone numbers, or emails.
        </p>
        <TraceToggle trace={response.trace} showTrace={showTrace} setShowTrace={setShowTrace} />
      </div>
    );
  }

  // 3. Disambiguation
  if (response.answerType === "disambiguation") {
    return (
      <div className="rounded-xl border border-[#e8e3db] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6c655d]">
            Plan Clarification Needed
          </p>
          <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
            Disambiguation
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-[1.65] text-[#1a1815]">{response.answer}</p>
        {response.disambiguationOptions && response.disambiguationOptions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {response.disambiguationOptions.map((opt) => (
              <button
                key={opt.question}
                type="button"
                onClick={() => onAsk(opt.question)}
                className="rounded-lg border border-[#a6521e]/35 bg-[#fdf4ee] px-3.5 py-2 text-[13px] font-medium text-[#7d3d16] hover:bg-[#a6521e]/15 transition-colors"
              >
                {opt.label} →
              </button>
            ))}
          </div>
        )}
        <TraceToggle trace={response.trace} showTrace={showTrace} setShowTrace={setShowTrace} />
      </div>
    );
  }

  // 4. Out of Scope / No Source
  if (response.answerType === "out_of_scope" || response.answerType === "no_source") {
    return (
      <div className="rounded-xl border border-[#e8e3db] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6c655d]">
            {response.answerType === "out_of_scope" ? "Outside Corpus Scope" : "Not Found in Official Sources"}
          </p>
          <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
            {response.answerType === "out_of_scope" ? "Out of Scope" : "No Source"}
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-[1.65] text-[#1a1815]">{response.answer}</p>
        <p className="mt-2 text-xs text-[#6c655d]">
          Golden rule: If the official source does not say it, the assistant does not guess.
        </p>
        <TraceToggle trace={response.trace} showTrace={showTrace} setShowTrace={setShowTrace} />
      </div>
    );
  }

  // 5. Fact (Path 1) or Explanation (Path 2)
  return (
    <div className="rounded-xl border border-[#e8e3db] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6c655d]">
          {response.answerType === "fact" ? "Verified Scheme Fact (Path 1)" : "Grounded Explanation (Path 2 RAG)"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded border border-[#e8e3db] px-2 py-0.5 text-[10px] text-[#6c655d] hover:bg-[#fbfaf8] hover:text-[#1a1815] font-medium transition-colors"
          >
            {copied ? "✓ Copied" : "Copy Fact & Citation"}
          </button>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-medium ${
              response.answerType === "fact"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {response.answerType === "fact" ? "Fact Table" : "Hybrid RAG"}
          </span>
        </div>
      </div>

      <p className="mt-2.5 text-[15px] leading-[1.65] text-[#1a1815] font-normal">{response.answer}</p>
      
      <JargonChips text={response.answer} />

      <CitationsList citations={response.citations} />

      {/* Suggested Follow-Up Chips */}
      {response.suggestedFollowUps && response.suggestedFollowUps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#e8e3db]/60">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6c655d] block mb-2">
            Suggested Next Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {response.suggestedFollowUps.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onAsk(q)}
                className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] px-2.5 py-1 text-xs text-[#1a1815] hover:border-[#a6521e]/50 hover:bg-[#fdf4ee] hover:text-[#7d3d16] transition-colors"
              >
                {q} →
              </button>
            ))}
          </div>
        </div>
      )}

      <TraceToggle trace={response.trace} showTrace={showTrace} setShowTrace={setShowTrace} />
    </div>
  );
}

function TraceToggle({
  trace,
  showTrace,
  setShowTrace,
}: {
  trace: any;
  showTrace: boolean;
  setShowTrace: (val: boolean) => void;
}) {
  if (!trace) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-[#e8e3db]/60 text-xs">
      <button
        onClick={() => setShowTrace(!showTrace)}
        className="text-[#6c655d] hover:text-[#1a1815] flex items-center gap-1 font-mono"
      >
        <span>{showTrace ? "▼" : "▶"}</span>
        <span>Inspect System Decision Trace ({trace.ms}ms)</span>
      </button>

      {showTrace && (
        <div className="mt-2 rounded-lg bg-[#fbfaf8] border border-[#e8e3db] p-3 font-mono text-[11px] space-y-1.5 text-[#1a1815]">
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Pipeline Latency:</span>
            <span className="font-semibold">{trace.ms} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6c655d]">PII Guard:</span>
            <span>{trace.piiGuard?.flagged ? `FLAGGED (${trace.piiGuard.kind})` : "Clean"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Injection Guard:</span>
            <span>{trace.injectionGuard?.flagged ? "FLAGGED" : "Clean"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Entity Scope:</span>
            <span>{trace.scopeCheck?.scope}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Router Intent:</span>
            <span>{trace.router?.intent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Path Chosen:</span>
            <span className="font-bold text-[#a6521e]">{trace.pathTaken}</span>
          </div>
          {trace.retrieval && (
            <div className="flex justify-between">
              <span className="text-[#6c655d]">RAG Score / Floor:</span>
              <span>
                {trace.retrieval.topScore ?? "N/A"} (Floor: 0.50, Passed: {String(trace.retrieval.scoreFloorPassed)})
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#6c655d]">Citations Attached:</span>
            <span>{trace.citationsCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
