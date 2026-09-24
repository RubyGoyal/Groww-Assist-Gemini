import React, { useState } from "react";
import { Header, type ActiveTab } from "./components/Header.tsx";
import { ChatView } from "./components/ChatView.tsx";
import { CompareView } from "./components/CompareView.tsx";
import { ExitLoadCalculator } from "./components/ExitLoadCalculator.tsx";
import { GlossaryView } from "./components/GlossaryModal.tsx";
import { ArchitectureView } from "./components/ArchitectureView.tsx";
import { FactTableView } from "./components/FactTableView.tsx";
import { SourcesView } from "./components/SourcesView.tsx";
import { EvalView } from "./components/EvalView.tsx";
import { DocsView } from "./components/DocsView.tsx";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#1a1815] flex flex-col font-sans selection:bg-[#fdf4ee] selection:text-[#7d3d16]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        {activeTab === "chat" && <ChatView />}
        {activeTab === "compare" && <CompareView />}
        {activeTab === "calculator" && <ExitLoadCalculator />}
        {activeTab === "glossary" && <GlossaryView />}
        {activeTab === "arch" && <ArchitectureView />}
        {activeTab === "facts" && <FactTableView />}
        {activeTab === "sources" && <SourcesView />}
        {activeTab === "eval" && <EvalView />}
        {activeTab === "docs" && <DocsView />}
      </main>

      <footer className="border-t border-[#e8e3db] bg-[#fbfaf8] py-8 text-xs leading-relaxed text-[#6c655d]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-2">
          <p>
            Groww is a SEBI-registered broker and an AMFI-registered mutual fund distributor, not a SEBI-registered
            Investment Adviser. This assistant explains what official scheme documents say. It does not recommend
            investments, and it does not calculate returns.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-[#6c655d]/80">
            <span>Last updated from sources: 21 September 2026 IST</span>
            <span>Corpus version: 2026-09-21-a963e690 · All 40 Golden Cases Met</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
