import React, { useState, useRef, useEffect } from "react";
import { AnswerCard } from "./AnswerCard.tsx";
import { SchemeCards } from "./SchemeCards.tsx";
import type { AskResponse, Turn } from "../lib/types.ts";
import { Download, Sparkles, Volume2, VolumeX, Trash2, ArrowRight } from "lucide-react";

interface PromptCategory {
  category: string;
  prompts: { label: string; question: string }[];
}

const CATEGORIZED_PROMPTS: PromptCategory[] = [
  {
    category: "Charges & Fees",
    prompts: [
      { label: "ELSS Regular TER", question: "What is the expense ratio of Groww ELSS Tax Saver Fund regular plan?" },
      { label: "Large Cap Direct TER", question: "What is the expense ratio of Groww Large Cap Fund direct plan?" },
      { label: "Nifty Total Market TER", question: "What is the expense ratio of Groww Nifty Total Market Index Fund?" },
    ],
  },
  {
    category: "Exit Load & Lock-in",
    prompts: [
      { label: "Liquid Fund Graded Load", question: "What is the exit load on Groww Liquid Fund?" },
      { label: "ELSS 3-Year Lock-in", question: "What is the lock-in period for Groww ELSS Tax Saver Fund?" },
      { label: "Index Fund Exit Window", question: "What is the exit load for Groww Nifty Total Market Index Fund?" },
    ],
  },
  {
    category: "Statements & Forms",
    prompts: [
      { label: "Capital Gains Statement", question: "How do I download my capital gains statement?" },
      { label: "Consolidated Statement (CAS)", question: "How can I get a consolidated account statement (CAS)?" },
      { label: "Register SIP via KIM", question: "How is an SIP registered through the KIM application form?" },
    ],
  },
  {
    category: "Regulatory Boundaries (Refusals)",
    prompts: [
      { label: "Advice Refusal Probe", question: "Should I invest in Groww ELSS Tax Saver Fund?" },
      { label: "Returns Comparison Probe", question: "Which fund gave better returns between Large Cap and Index?" },
      { label: "PII Guard Probe", question: "My PAN is ABCDE1234F, what is my account balance?" },
      { label: "Out of Scope AMC", question: "What is the expense ratio of HDFC Top 100 Fund?" },
    ],
  },
];

interface Exchange {
  question: string;
  response: AskResponse | null;
  timestamp: string;
}

export function ChatView() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Charges & Fees");
  const [readingIdx, setReadingIdx] = useState<number | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [exchanges, loading]);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleAsk(queryText: string) {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setInput("");
    setError(null);
    setLoading(true);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Build history from settled turns (last 3 exchanges max)
    const history: Turn[] = exchanges
      .filter((e) => e.response !== null)
      .flatMap((e) => [
        { role: "user" as const, content: e.question },
        { role: "assistant" as const, content: e.response!.answer },
      ])
      .slice(-6);

    // Optimistically append user exchange
    setExchanges((prev) => [...prev, { question: trimmed, response: null, timestamp: now }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, history }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Server responded with ${res.status}`);
      }

      const data: AskResponse = await res.json();
      setExchanges((prev) =>
        prev.map((e, idx) => (idx === prev.length - 1 ? { ...e, response: data } : e))
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch response.");
      setExchanges((prev) => prev.slice(0, -1)); // remove unanswered question on failure
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setExchanges([]);
    setInput("");
    setError(null);
    setReadingIdx(null);
  }

  // Audio Read-aloud
  function toggleSpeech(idx: number, text: string) {
    if (!window.speechSynthesis) return;

    if (readingIdx === idx) {
      window.speechSynthesis.cancel();
      setReadingIdx(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setReadingIdx(null);
      utterance.onerror = () => setReadingIdx(null);
      window.speechSynthesis.speak(utterance);
      setReadingIdx(idx);
    }
  }

  // Export conversation audit dossier
  function exportAuditDossier() {
    const timestamp = new Date().toISOString();
    let dossier = `# Groww Assist — Mutual Fund Factual Q&A Audit Dossier\n`;
    dossier += `Generated: ${timestamp} IST\n`;
    dossier += `Corpus: 2026-09-21-a963e690 (Groww Asset Management Limited)\n`;
    dossier += `Legal Status: Distributor Explainer (No Investment Advice)\n\n---\n\n`;

    exchanges.forEach((ex, idx) => {
      dossier += `### Query ${idx + 1} [${ex.timestamp}]\n`;
      dossier += `**User:** ${ex.question}\n\n`;
      if (ex.response) {
        dossier += `**Assistant (${ex.response.answerType}):** ${ex.response.answer}\n\n`;
        if (ex.response.citations && ex.response.citations.length > 0) {
          dossier += `**Verified Citations:**\n`;
          ex.response.citations.forEach((c) => {
            dossier += `- [${c.title}](${c.url}) (${c.publisher}, Effective: ${c.sourceEffectiveDate || "Live page"})\n`;
          });
          dossier += `\n`;
        }
      }
      dossier += `---\n\n`;
    });

    dossier += `**Disclaimer Snippet:** Facts only. No investment advice.\n`;

    const blob = new Blob([dossier], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groww-assist-audit-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-1 flex-col pb-6">
      {exchanges.length === 0 && (
        <section className="py-6 space-y-6">
          {/* Welcome Banner */}
          <div className="rounded-2xl border border-[#e8e3db] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6c655d]">
                4 Groww Schemes · Verified SEBI & AMFI Filings
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1815]">
              Facts-Only Mutual Fund Q&A Assistant
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6c655d] leading-relaxed">
              Ask about expense ratios, exit load schedules, ELSS 3-year lock-in rules, riskometer levels, benchmarks, or RTA statement downloads.
              Every factual answer cites official public pages. Investment advice and returns predictions are politely refused.
            </p>
          </div>

          {/* Scheme Quick Explorer Cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6c655d]">
                In-Scope Schemes (Click for Quick Inquiries)
              </span>
              <span className="text-[11px] font-mono text-[#7d3d16]">growwmf.in verified</span>
            </div>
            <SchemeCards onAsk={handleAsk} />
          </div>

          {/* Categorized Example Questions */}
          <div className="rounded-2xl border border-[#e8e3db] bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6c655d] block mb-3">
              Explore by Inquiry Category:
            </span>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 border-b border-[#e8e3db] pb-3 mb-3">
              {CATEGORIZED_PROMPTS.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat.category
                      ? "bg-[#1a1815] text-white"
                      : "bg-[#fbfaf8] text-[#6c655d] border border-[#e8e3db] hover:text-[#1a1815]"
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Category Prompts */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIZED_PROMPTS.find((c) => c.category === selectedCategory)?.prompts.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleAsk(p.question)}
                  className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] px-3 py-2 text-xs text-[#1a1815] transition-all hover:border-[#a6521e]/50 hover:bg-[#fdf4ee] hover:text-[#7d3d16] flex items-center gap-1.5"
                >
                  <span>{p.label}</span>
                  <ArrowRight className="h-3 w-3 text-[#6c655d]" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Exchanges List */}
      <div className="flex flex-col gap-6 pt-2">
        {exchanges.map((exchange, idx) => (
          <div key={`${idx}-${exchange.question}`} className="flex flex-col gap-2.5">
            {/* User message */}
            <div className="flex justify-end items-baseline gap-2">
              <span className="text-[10px] font-mono text-[#6c655d]">{exchange.timestamp}</span>
              <div className="rounded-xl bg-[#1a1815] px-4 py-2.5 text-sm text-white max-w-[85%] shadow-xs">
                {exchange.question}
              </div>
            </div>

            {/* Assistant response */}
            {exchange.response ? (
              <div className="relative group">
                <AnswerCard response={exchange.response} onAsk={handleAsk} />
                
                {/* Micro Action Buttons on Card */}
                <div className="mt-1 flex items-center justify-end gap-2 px-1 text-xs text-[#6c655d]">
                  <button
                    type="button"
                    onClick={() => toggleSpeech(idx, exchange.response!.answer)}
                    className="hover:text-[#1a1815] flex items-center gap-1 text-[11px]"
                    title="Read answer aloud"
                  >
                    {readingIdx === idx ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-[#a6521e]" />
                        <span className="text-[#a6521e]">Stop voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#e8e3db] bg-white p-4 shadow-xs text-xs text-[#6c655d] flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#a6521e] animate-ping" />
                <span>Evaluating PII guards, entity scope, and retrieving verified disclosures…</span>
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <p className="font-semibold">Unable to complete request</p>
            <p className="mt-1">{error}</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(input);
        }}
        className="sticky bottom-0 mt-8 border-t border-[#e8e3db] bg-[#fbfaf8] pt-4"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about expense ratio, exit load, ELSS lock-in, statements, riskometer..."
              className="w-full rounded-xl border border-[#e8e3db] bg-white px-4 py-3 pr-20 text-sm text-[#1a1815] placeholder:text-[#6c655d]/60 focus:border-[#a6521e] focus:outline-none disabled:opacity-60 shadow-xs"
            />
            <kbd className="hidden sm:inline-block absolute right-3 top-3.5 rounded border border-[#e8e3db] bg-[#fbfaf8] px-1.5 py-0.5 text-[10px] font-mono text-[#6c655d]">
              ⌘K
            </kbd>
          </div>

          <button
            type="submit"
            disabled={loading || input.trim().length === 0}
            className="rounded-xl bg-[#a6521e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7d3d16] disabled:opacity-40 transition-colors shadow-xs shrink-0"
          >
            {loading ? "Searching..." : "Ask"}
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs text-[#6c655d]">
          <span>Strictly factual answers with verified citations · No investment advice</span>
          
          <div className="flex items-center gap-3">
            {exchanges.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportAuditDossier}
                  className="text-[#6c655d] hover:text-[#1a1815] flex items-center gap-1 font-medium transition-colors"
                  title="Export conversation as Markdown audit log"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="text-[#a6521e] hover:underline flex items-center gap-1 font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
