import React, { useState } from "react";
import { Calculator, ShieldAlert, FileText, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { SCHEME_DISPLAY } from "../lib/facts/lookup.ts";

export function ExitLoadCalculator() {
  const [selectedScheme, setSelectedScheme] = useState<string>("groww-liquid");
  const [holdingDays, setHoldingDays] = useState<number>(3);
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);

  // Factual exit load calculations per official SID tables
  function calculateExitLoad(scheme: string, days: number, amount: number) {
    if (scheme === "groww-liquid") {
      // Day 1 to 7 day-wise graded exit load from live SID
      let rate = 0;
      let rule = "Nil after 7 Days";
      if (days <= 1) {
        rate = 0.0070;
        rule = "0.0070% if exited within 0 to 1 days from purchase NAV date";
      } else if (days === 2) {
        rate = 0.0065;
        rule = "0.0065% if exited on Day 2";
      } else if (days === 3) {
        rate = 0.0060;
        rule = "0.0060% if exited on Day 3";
      } else if (days === 4) {
        rate = 0.0055;
        rule = "0.0055% if exited on Day 4";
      } else if (days === 5) {
        rate = 0.0050;
        rule = "0.0050% if exited on Day 5";
      } else if (days === 6) {
        rate = 0.0045;
        rule = "0.0045% if exited on Day 6";
      } else {
        rate = 0;
        rule = "Nil (0.0000%) if redeemed on Day 7 onwards";
      }

      const deduction = (amount * rate) / 100;
      return {
        ratePercent: rate,
        ruleText: rule,
        deductionApprox: deduction,
        netProceeds: amount - deduction,
        lockIn: "None",
        sourceId: "liquid-direct-page",
        sourceTitle: "Groww Liquid Fund Direct Growth (growwmf.in)",
        sourceUrl: "https://growwmf.in/mutual-funds/groww-liquid-fund-direct-growth",
      };
    }

    if (scheme === "groww-elss-tax-saver") {
      const isLocked = days < 365 * 3;
      return {
        ratePercent: 0,
        ruleText: isLocked
          ? "Units cannot be redeemed during the statutory 3-year lock-in period."
          : "Nil exit load after completion of the 3-year lock-in period.",
        deductionApprox: 0,
        netProceeds: amount,
        lockIn: "3 Years mandatory (under Section 80C)",
        isLocked,
        sourceId: "elss-direct-page",
        sourceTitle: "Groww ELSS Tax Saver Fund Direct Growth",
        sourceUrl: "https://growwmf.in/mutual-funds/groww-elss-tax-saver-fund-direct-growth",
      };
    }

    if (scheme === "groww-nifty-total-market-index") {
      const isSubjectToLoad = days <= 7;
      const rate = isSubjectToLoad ? 0.25 : 0;
      const deduction = (amount * rate) / 100;
      return {
        ratePercent: rate,
        ruleText: isSubjectToLoad
          ? "0.25% if redeemed or switched out on or before 7 days from the date of allotment"
          : "Nil if redeemed or switched out after 7 days from allotment",
        deductionApprox: deduction,
        netProceeds: amount - deduction,
        lockIn: "None",
        sourceId: "nifty-tmi-direct-page",
        sourceTitle: "Groww Nifty Total Market Index Fund Direct Growth",
        sourceUrl: "https://growwmf.in/mutual-funds/groww-nifty-total-market-index-fund-direct-growth",
      };
    }

    // Groww Large Cap Fund
    const isSubjectToLoad = days <= 30;
    const rate = isSubjectToLoad ? 1.0 : 0;
    const deduction = (amount * rate) / 100;
    return {
      ratePercent: rate,
      ruleText: isSubjectToLoad
        ? "1.00% if redeemed on or before 30 days from allotment"
        : "Nil if redeemed after 30 days from allotment",
      deductionApprox: deduction,
      netProceeds: amount - deduction,
      lockIn: "None",
      sourceId: "large-cap-direct-page",
      sourceTitle: "Groww Large Cap Fund Direct Growth",
      sourceUrl: "https://growwmf.in/mutual-funds/groww-large-cap-fund-direct-growth",
    };
  }

  const result = calculateExitLoad(selectedScheme, holdingDays, investmentAmount);

  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#a6521e]" />
            <h2 className="text-xl font-bold text-[#1a1815]">Exit Load & Lock-in Simulator</h2>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
            Factual SID Formula
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6c655d]">
          Simulate the exact exit load deduction and lock-in period for your holding duration based strictly on the Scheme Information Document (SID) filed with SEBI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-[#e8e3db] bg-white p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#1a1815]">Select Parameters</h3>

          {/* Scheme Selection */}
          <div>
            <label className="text-xs font-semibold text-[#6c655d] uppercase block mb-1.5">
              Mutual Fund Scheme
            </label>
            <div className="space-y-2">
              {Object.entries(SCHEME_DISPLAY).map(([slug, name]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setSelectedScheme(slug)}
                  className={`w-full text-left rounded-lg p-2.5 text-xs transition-all flex items-center justify-between ${
                    selectedScheme === slug
                      ? "border border-[#a6521e] bg-[#fdf4ee] text-[#7d3d16] font-semibold"
                      : "border border-[#e8e3db] bg-[#fbfaf8] text-[#1a1815] hover:bg-stone-50"
                  }`}
                >
                  <span>{name}</span>
                  {selectedScheme === slug && <CheckCircle2 className="h-4 w-4 text-[#a6521e]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Holding Days */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-[#6c655d] uppercase">
                Holding Duration
              </label>
              <span className="font-mono text-sm font-bold text-[#1a1815]">
                {holdingDays} {holdingDays === 1 ? "Day" : "Days"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={selectedScheme === "groww-elss-tax-saver" ? 1200 : selectedScheme === "groww-liquid" ? 14 : 45}
              value={holdingDays}
              onChange={(e) => setHoldingDays(parseInt(e.target.value, 10))}
              className="w-full accent-[#a6521e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6c655d] font-mono mt-1">
              <span>0 Days</span>
              {selectedScheme === "groww-liquid" && <span>Day 7 (Nil)</span>}
              {selectedScheme === "groww-elss-tax-saver" && <span>3 Yrs (1095 Days)</span>}
              <span>
                {selectedScheme === "groww-elss-tax-saver" ? "1200 Days" : selectedScheme === "groww-liquid" ? "14 Days" : "45 Days"}
              </span>
            </div>
          </div>

          {/* Investment Amount */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-[#6c655d] uppercase">
                Redemption Gross Value (₹)
              </label>
              <span className="font-mono text-xs text-[#6c655d]">
                ₹{investmentAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="number"
              step="5000"
              min="1000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Math.max(0, parseInt(e.target.value || "0", 10)))}
              className="w-full rounded-lg border border-[#e8e3db] px-3 py-2 text-xs font-mono text-[#1a1815] focus:border-[#a6521e] focus:outline-none"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 rounded-xl border border-[#e8e3db] bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e3db]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6c655d]">
                Factual Outcome
              </span>
              <span className="font-mono text-[11px] text-[#6c655d]">
                Holding: {holdingDays} Days
              </span>
            </div>

            {/* Lock-in Warning for ELSS */}
            {selectedScheme === "groww-elss-tax-saver" && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  <span>Statutory Lock-in Period Status:</span>
                </div>
                <p>
                  {holdingDays < 1095 ? (
                    <span className="font-semibold text-red-700">
                      Locked — Units cannot be redeemed or switched out before completing 3 full years (1,095 days) from allotment.
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-800">
                      Unlocked — 3-year lock-in period completed. Redemptions are permitted with Nil exit load.
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Calculation Cards */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[10px] text-[#6c655d] uppercase block">Exit Load Rate</span>
                <span className={`text-base font-bold mt-1 block ${result.ratePercent > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                  {result.ratePercent.toFixed(4)}%
                </span>
              </div>
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3">
                <span className="text-[10px] text-[#6c655d] uppercase block">Deduction (₹)</span>
                <span className="text-base font-bold text-[#1a1815] mt-1 block">
                  ₹{Math.round(result.deductionApprox).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="rounded-lg border border-[#e8e3db] bg-[#fbfaf8] p-3 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#6c655d] uppercase block">Net Proceeds</span>
                <span className="text-base font-bold text-emerald-800 mt-1 block">
                  ₹{Math.round(result.netProceeds).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Official Rule text */}
            <div className="mt-4 rounded-lg bg-[#fbfaf8] border border-[#e8e3db] p-3.5 text-xs">
              <span className="text-[#6c655d] font-semibold block mb-1">Applicable SID Schedule:</span>
              <p className="text-[#1a1815] font-medium leading-relaxed">{result.ruleText}</p>
            </div>
          </div>

          {/* Authoritative Citation */}
          <div className="pt-3 border-t border-[#e8e3db] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#6c655d]">
              <FileText className="h-3.5 w-3.5 text-[#a6521e]" />
              <span className="truncate max-w-xs">{result.sourceTitle}</span>
            </div>
            <a
              href={result.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#a6521e] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Verify in SID</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
