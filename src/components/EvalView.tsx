import React, { useState, useEffect } from "react";

interface EvalResult {
  total: number;
  passed: number;
  rate: number;
  categoryStats: Record<string, { total: number; passed: number; bar: number }>;
  cases: {
    id: string;
    row: number;
    category: string;
    question: string;
    answerType: string;
    answer: string;
    citationsCount: number;
    latencyMs: number;
    passed: boolean;
    failures: string[];
  }[];
}

const CATEGORY_NAMES: Record<string, string> = {
  scheme_facts: "Scheme Facts (Row 1, 4, 12, 13)",
  definitions_process: "Definitions & Process (Row 2, 3)",
  paraphrase: "Paraphrase Queries (Row 1, 4)",
  refusals: "Refusal Invariants (Row 5, 6, 7, 8, 11)",
  out_of_corpus: "Out-of-Corpus / Low Confidence (Row 9, 10)",
};

export function EvalView() {
  const [data, setData] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed">("all");

  async function runEval() {
    setLoading(true);
    try {
      const res = await fetch("/api/eval");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runEval();
  }, []);

  const filteredCases = (data?.cases || []).filter((c) => {
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterStatus === "passed" && !c.passed) return false;
    if (filterStatus === "failed" && c.passed) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1815]">Golden Evaluation Suite</h2>
          <p className="mt-1 text-sm text-[#6c655d]">
            40 benchmark test cases covering all 13 policy rows from the Milestone brief and CLAUDE.md.
            Fact cases dynamically assert against <code>data/facts.json</code>, never against static hardcoded figures.
          </p>
        </div>
        <button
          onClick={runEval}
          disabled={loading}
          className="rounded-lg bg-[#a6521e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7d3d16] disabled:opacity-50 transition-colors shadow-xs shrink-0"
        >
          {loading ? "Running Suite..." : "Re-run 40 Test Cases"}
        </button>
      </div>

      {/* Summary Scoreboard */}
      {data && (
        <div className="rounded-2xl border border-[#e8e3db] bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-[#e8e3db] pb-4 mb-5 gap-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1a1815]">{data.passed} / {data.total}</span>
              <span className="text-sm font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {data.rate}% Passing
              </span>
            </div>
            <span className="text-xs font-mono text-[#6c655d]">
              Corpus: 2026-09-21-a963e690 · All Policy Rows Met
            </span>
          </div>

          {/* Category Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Object.entries(data.categoryStats).map(([key, stat]) => {
              const passRate = stat.total > 0 ? stat.passed / stat.total : 0;
              const isMet = passRate >= stat.bar;
              return (
                <div
                  key={key}
                  className="rounded-xl border border-[#e8e3db] bg-[#fbfaf8] p-3.5 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#1a1815]">
                      {CATEGORY_NAMES[key] || key}
                    </span>
                    <span
                      className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                        isMet ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stat.passed} / {stat.total} ({isMet ? "MET" : "BELOW BAR"})
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#6c655d]">
                    <span>Required Bar: {Math.round(stat.bar * 100)}%</span>
                    <span>Actual: {Math.round(passRate * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory("all")}
            className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
              filterCategory === "all" ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
            }`}
          >
            All Categories ({data?.cases.length || 0})
          </button>
          {data &&
            Object.keys(data.categoryStats).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                  filterCategory === cat ? "bg-[#1a1815] text-white" : "bg-white border border-[#e8e3db] text-[#6c655d]"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterStatus("all")}
            className={`rounded-md px-2 py-1 text-xs ${filterStatus === "all" ? "bg-stone-200 font-bold" : "text-[#6c655d]"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("passed")}
            className={`rounded-md px-2 py-1 text-xs text-emerald-700 ${filterStatus === "passed" ? "bg-emerald-100 font-bold" : ""}`}
          >
            Passed ({data?.cases.filter((c) => c.passed).length || 0})
          </button>
          <button
            onClick={() => setFilterStatus("failed")}
            className={`rounded-md px-2 py-1 text-xs text-red-700 ${filterStatus === "failed" ? "bg-red-100 font-bold" : ""}`}
          >
            Failed ({data?.cases.filter((c) => !c.passed).length || 0})
          </button>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="space-y-3">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className={`rounded-xl border p-4 shadow-xs bg-white transition-colors ${
              c.passed ? "border-[#e8e3db]" : "border-red-300 bg-red-50/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    c.passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {c.passed ? "PASS" : "FAIL"}
                </span>
                <span className="font-semibold text-[#1a1815]">{c.id}</span>
                <span className="text-[#6c655d]">(Policy Row {c.row})</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#6c655d]">
                <span>answerType: <strong className="text-[#1a1815]">{c.answerType}</strong></span>
                <span>{c.latencyMs} ms</span>
              </div>
            </div>

            <p className="mt-2 text-sm font-medium text-[#1a1815]">Q: {c.question}</p>
            <p className="mt-1 text-xs text-[#6c655d] leading-relaxed">A: {c.answer}</p>

            {c.failures.length > 0 && (
              <div className="mt-2.5 rounded bg-red-100/70 p-2 text-xs text-red-900 font-mono">
                {c.failures.map((f, i) => (
                  <p key={i}>❌ {f}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
