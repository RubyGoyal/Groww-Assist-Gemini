import React from "react";
import { MessageSquare, Columns3, BookOpen, Layers, Database, ShieldCheck, CheckSquare, FileText, Calculator } from "lucide-react";

export type ActiveTab =
  | "chat"
  | "compare"
  | "calculator"
  | "glossary"
  | "arch"
  | "facts"
  | "sources"
  | "eval"
  | "docs";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Assistant", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: "compare", label: "Compare Matrix", icon: <Columns3 className="h-3.5 w-3.5" /> },
    { id: "calculator", label: "Exit Load Calc", icon: <Calculator className="h-3.5 w-3.5" /> },
    { id: "glossary", label: "Jargon Buster", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { id: "arch", label: "Architecture", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "facts", label: "Fact Table", icon: <Database className="h-3.5 w-3.5" /> },
    { id: "sources", label: "Sources (23)", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: "eval", label: "Golden Eval (40)", icon: <CheckSquare className="h-3.5 w-3.5" /> },
    { id: "docs", label: "Docs", icon: <FileText className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8e3db] bg-[#fbfaf8]/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1815] text-white font-bold text-base shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-[#1a1815]">Groww Assist</h1>
                <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#6c655d]">
                  v1.2.0
                </span>
              </div>
              <p className="text-[11px] text-[#6c655d] leading-none">
                Facts-Only Mutual Fund RAG Assistant · Verified Sources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Evaluation Passed (40/40)
            </span>
            <div className="rounded-full border border-[#a6521e]/30 bg-[#fdf4ee] px-2.5 py-1 text-[11px] font-medium text-[#7d3d16]">
              Facts only · No advice
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                  isActive
                    ? "bg-[#1a1815] text-white shadow-xs"
                    : "text-[#6c655d] hover:bg-[#e8e3db]/60 hover:text-[#1a1815]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
