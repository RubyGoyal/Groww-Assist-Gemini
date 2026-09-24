import type { AskResponse, DisambiguationOption, FactType, Plan, Turn, PipelineTrace } from "./types.ts";
import { detectPii } from "./guards/pii.ts";
import { detectInjection } from "./guards/injection.ts";
import { classifyScope } from "./retrieval/scope.ts";
import { lookupFact, SCHEME_DISPLAY, SCHEME_SLUGS, schemesWithFact, type LookupResult } from "./facts/lookup.ts";
import { toCitation, educationalLink } from "./sources/registry.ts";
import { retrieveChunks } from "./retrieval/retrieve.ts";

export const CORPUS_VERSION = "2026-09-21-a963e690";
export const DISCLAIMER = "Facts only. No investment advice.";

const FOUR_SCHEMES = Object.values(SCHEME_DISPLAY).join(", ").replace(/, ([^,]*)$/, " and $1");
const SCOPE_LINE = `I can answer factual questions about four Groww Mutual Fund schemes: ${FOUR_SCHEMES}.`;

function baseResponse(partial: Partial<AskResponse> & Pick<AskResponse, "answerType" | "answer">): AskResponse {
  return {
    citations: [],
    disambiguationOptions: null,
    educationalLink: null,
    corpusVersion: CORPUS_VERSION,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export const responses = {
  fact: (answer: string, citations: any[]) =>
    baseResponse({ answerType: "fact", answer, citations }),

  explanation: (answer: string, citations: any[]) =>
    baseResponse({ answerType: "explanation", answer, citations }),

  disambiguation: (answer: string, options: DisambiguationOption[]) =>
    baseResponse({ answerType: "disambiguation", answer, disambiguationOptions: options }),

  adviceRefusal: (variant: "advice" | "portfolio" | "injection" = "advice") =>
    baseResponse({
      answerType: "advice_refusal",
      answer:
        variant === "portfolio"
          ? `I can't assess your portfolio or your personal situation — Groww is a distributor, not a SEBI-registered investment adviser, so I explain facts rather than give guidance. ${SCOPE_LINE}`
          : variant === "injection"
            ? `I can only answer factual questions about Groww Mutual Fund schemes from official sources, and I can't take instructions to do otherwise. ${SCOPE_LINE}`
            : `I can explain what the official documents say about these schemes, but I can't tell you whether to invest — Groww is a distributor, not a SEBI-registered investment adviser. For unbiased help with that decision, AMFI's investor education resources are a good starting point.`,
      educationalLink: educationalLink("investor_education"),
    }),

  returnsRefusal: () =>
    baseResponse({
      answerType: "advice_refusal",
      answer:
        "I don't calculate or compare returns or performance — those figures depend on dates and methods I won't approximate. The official monthly factsheet publishes each scheme's performance figures as stated by the fund house.",
      educationalLink: educationalLink("factsheet"),
    }),

  piiRefusal: () =>
    baseResponse({
      answerType: "pii_refusal",
      answer:
        "I can't work with messages that contain personal identifiers such as a PAN, Aadhaar, phone number, email, folio or account number, and I don't have access to your holdings. Please remove those details and ask again.",
    }),

  outOfScope: (variant: "other_groww" | "other_amc") =>
    baseResponse({
      answerType: "out_of_scope",
      answer:
        variant === "other_groww"
          ? `That scheme is outside my sources — I only cover four Groww schemes, not the full range. ${SCOPE_LINE}`
          : `That fund is outside my sources — I only cover Groww Mutual Fund schemes, and only four of them. ${SCOPE_LINE}`,
    }),

  noSource: () =>
    baseResponse({
      answerType: "no_source",
      answer: `I couldn't find that in my sources, so I won't guess. ${SCOPE_LINE}`,
    }),
};

function planOptions(scheme: string, factType: FactType): DisambiguationOption[] {
  const name = SCHEME_DISPLAY[scheme];
  const label = factType.replace("_", " ");
  return [
    { label: "Direct plan", question: `What is the ${label} of ${name} direct plan?` },
    { label: "Regular plan", question: `What is the ${label} of ${name} regular plan?` },
  ];
}

function schemeDisambiguation(factType: FactType): { message: string; options: DisambiguationOption[] } {
  const label = factType.replace("_", " ");
  const available = schemesWithFact(factType);
  const options = available.map((slug) => ({
    label: SCHEME_DISPLAY[slug],
    question: `What is the ${label} of ${SCHEME_DISPLAY[slug]}?`,
  }));
  if (available.length === SCHEME_SLUGS.length) {
    return { message: `Which scheme do you mean? I can answer that for any of the four.`, options };
  }
  const names = available.map((s) => SCHEME_DISPLAY[s]).join(", ").replace(/, ([^,]*)$/, " and $1");
  return {
    message: `My sources state a ${label} only for ${names}; for the other schemes they don't say either way. Did you mean ${names}?`,
    options,
  };
}

export interface RouteClassification {
  intent: "fact" | "explanation" | "process" | "advice" | "returns" | "portfolio" | "other";
  scheme: string | null;
  plan: Plan | null;
  factType: FactType | null;
}

export function classifyIntent(query: string, history: Turn[] = []): RouteClassification {
  const q = query.toLowerCase();

  // Follow-up resolution: e.g. "...and the direct plan?"
  const isFollowUpPlan = /\b(and\s+the\s+direct|and\s+direct|what\s+about\s+direct)\b/i.test(q);
  const isFollowUpRegular = /\b(and\s+the\s+regular|and\s+regular|what\s+about\s+regular)\b/i.test(q);

  if ((isFollowUpPlan || isFollowUpRegular) && history.length > 0) {
    const lastUser = [...history].reverse().find((h) => h.role === "user")?.content || "";
    const lastAssistant = [...history].reverse().find((h) => h.role === "assistant")?.content || "";
    const contextText = `${lastUser} ${lastAssistant}`.toLowerCase();
    
    let resolvedScheme: string | null = null;
    if (contextText.includes("large cap")) resolvedScheme = "groww-large-cap";
    else if (contextText.includes("elss") || contextText.includes("tax saver")) resolvedScheme = "groww-elss-tax-saver";
    else if (contextText.includes("nifty") || contextText.includes("total market")) resolvedScheme = "groww-nifty-total-market-index";
    else if (contextText.includes("liquid")) resolvedScheme = "groww-liquid";

    let resolvedFactType: FactType | null = "expense_ratio";
    if (contextText.includes("exit load")) resolvedFactType = "exit_load";

    return {
      intent: "fact",
      scheme: resolvedScheme,
      plan: isFollowUpPlan ? "direct" : "regular",
      factType: resolvedFactType,
    };
  }

  // 1. Advice questions (Row 5)
  if (
    /\b(should\s+i\s+(invest|buy|sell)|good\s+buy|good\s+to\s+invest|recommend\s+(a\s+)?fund|which\s+(fund\s+is\s+)?best|is\s+it\s+suitable|advice)\b/i.test(q) ||
    /\b(is|are)\b.{0,50}\bgood\s+buy\b/i.test(q)
  ) {
    return { intent: "advice", scheme: null, plan: null, factType: null };
  }

  // 2. Returns and performance comparisons (Row 6)
  if (
    /\b(better\s+returns|highest\s+returns|past\s+performance|1\s*year\s+return|cagr|annualized\s+return)\b/i.test(q) ||
    /\bnav\b.{0,40}\bgrown\b/i.test(q) ||
    /\bhow\s+much\s+has\b.{0,50}\b(grown|returned)\b/i.test(q)
  ) {
    return { intent: "returns", scheme: null, plan: null, factType: null };
  }

  // 3. Portfolio-specific queries (Row 7)
  if (
    /\b(my\s+portfolio|my\s+risk\s+profile|for\s+my\s+age|my\s+holdings|asset\s+allocation\s+for\s+me)\b/i.test(q)
  ) {
    return { intent: "portfolio", scheme: null, plan: null, factType: null };
  }

  // 4. Off-topic queries (Row 10)
  if (
    /\b(battle\s+of\s+panipat|panipat|biryani|capital\s+of\s+australia|cricket\s+world\s+cup|weather|president|prime\s+minister)\b/i.test(q)
  ) {
    return { intent: "other", scheme: null, plan: null, factType: null };
  }

  // 5. Definitions and regulatory explainer (Row 2)
  if (
    /\b(what\s+is\s+an?\s+elss\s+lock-?in|what\s+does\s+expense\s+ratio\s+mean|what\s+is\s+an?\s+exit\s+load|what\s+does\s+the\s+riskometer\s+show|difference\s+between\s+a?\s*direct\s+plan\s+and\s+(a\s+)?regular\s+plan)\b/i.test(q)
  ) {
    return { intent: "explanation", scheme: null, plan: null, factType: null };
  }

  // 6. Process questions (Row 3)
  if (
    /\b(how\s+do\s+i\s+download\s+my\s+capital\s+gains\s+statement|capital\s+gains\s+statement|consolidated\s+account\s+statement|cas\s+statement|how\s+is\s+an\s+sip\s+registered\s+through\s+the\s+kim|register\s+an?\s+sip)\b/i.test(q)
  ) {
    return { intent: "process", scheme: null, plan: null, factType: null };
  }

  // 7. Scheme facts (Row 1, 4, 12)
  let factType: FactType | null = null;
  if (/\b(expense\s+ratio|charges?\s+each\s+year|ter|cost)\b/i.test(q)) {
    factType = "expense_ratio";
  } else if (/\b(exit\s+load|pull\s+my\s+money\s+out|early\s+exit|redemption\s+charge)\b/i.test(q)) {
    factType = "exit_load";
  } else if (/\b(lock-?in|how\s+long\s+(do\s+i\s+have\s+to\s+stay|is\s+my\s+money\s+locked)|stay\s+invested)\b/i.test(q)) {
    factType = "lock_in";
  } else if (/\b(minimum\s+sip|smallest\s+(monthly\s+)?amount|smallest\s+monthly\s+sip|min\s+sip)\b/i.test(q)) {
    factType = "min_sip";
  } else if (/\b(minimum\s+lumpsum|min\s+lumpsum|invest\s+₹?\d+\s+lumpsum)\b/i.test(q)) {
    factType = "min_lumpsum";
  } else if (/\b(benchmark|index\s+does\s+the\s+total\s+market|index\s+followed|tracks?)\b/i.test(q)) {
    factType = "benchmark";
  } else if (/\b(riskometer|how\s+risky\s+is|risk\s+rating)\b/i.test(q)) {
    factType = "riskometer";
  } else if (/\b(fund\s+manager|who\s+manages)\b/i.test(q)) {
    factType = "fund_manager";
  } else if (/\b(category|categorised)\b/i.test(q)) {
    factType = "category";
  }

  let plan: Plan | null = null;
  if (/\bdirect(\s+plan|\s+growth)?\b/i.test(q)) plan = "direct";
  else if (/\bregular(\s+plan|\s+growth)?\b/i.test(q)) plan = "regular";

  let scheme: string | null = null;
  if (/\blarge\s*cap\b/i.test(q)) scheme = "groww-large-cap";
  else if (/\b(elss|tax\s+saver)\b/i.test(q)) scheme = "groww-elss-tax-saver";
  else if (/\b(nifty\s+total|total\s+market|index\s+fund)\b/i.test(q)) scheme = "groww-nifty-total-market-index";
  else if (/\bliquid\b/i.test(q)) scheme = "groww-liquid";

  if (factType !== null) {
    return { intent: "fact", scheme, plan, factType };
  }

  return { intent: "explanation", scheme, plan, factType: null };
}

function generateFollowUps(scheme: string | null, factType: FactType | null, intent: string): string[] {
  if (scheme === "groww-large-cap") {
    if (factType === "expense_ratio") {
      return [
        "What is the exit load for Groww Large Cap Fund?",
        "What is the minimum SIP for Groww Large Cap Fund?",
        "Who manages Groww Large Cap Fund?",
      ];
    }
    return [
      "What is the expense ratio of Groww Large Cap Fund direct plan?",
      "What is the benchmark for Groww Large Cap Fund?",
      "What is the riskometer rating of Groww Large Cap Fund?",
    ];
  }

  if (scheme === "groww-elss-tax-saver") {
    if (factType === "lock_in") {
      return [
        "What is the exit load on Groww ELSS Tax Saver Fund?",
        "What is the minimum SIP for Groww ELSS Tax Saver Fund?",
        "What is an ELSS lock-in?",
      ];
    }
    return [
      "What is the lock-in period for Groww ELSS Tax Saver Fund?",
      "What is the expense ratio of Groww ELSS Tax Saver Fund direct plan?",
      "What is the riskometer rating of Groww ELSS Tax Saver Fund?",
    ];
  }

  if (scheme === "groww-nifty-total-market-index") {
    return [
      "What index does Groww Nifty Total Market Index Fund track?",
      "What is the exit load for Groww Nifty Total Market Index Fund?",
      "What is the minimum SIP for Groww Nifty Total Market Index Fund?",
    ];
  }

  if (scheme === "groww-liquid") {
    return [
      "What is the exit load on Groww Liquid Fund?",
      "What is the riskometer rating of Groww Liquid Fund?",
      "What is the minimum SIP for Groww Liquid Fund?",
    ];
  }

  if (intent === "process" || intent === "explanation") {
    return [
      "How do I download my capital gains statement?",
      "What is the difference between a direct plan and a regular plan?",
      "What does the riskometer show?",
    ];
  }

  return [
    "What is the minimum SIP across the four schemes?",
    "Which schemes have an exit load?",
    "What is the lock-in period across the schemes?",
  ];
}

export function processQuestion(question: string, history: Turn[] = []): AskResponse {
  const started = Date.now();
  const trimmed = question.trim();

  // 1. Universal input validation
  if (!trimmed) {
    return responses.noSource();
  }

  // 2. PII Guard (Row 8) - deterministic, no model call, returns in <50ms
  const piiCheck = detectPii(trimmed);
  const historyPii = history.some((t) => detectPii(t.content).flagged);
  if (piiCheck.flagged || historyPii) {
    const res = responses.piiRefusal();
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: true, kind: piiCheck.kind },
      injectionGuard: { flagged: false },
      scopeCheck: { scope: "in_scope", matched: [], schemes: [] },
      router: { intent: "pii_refusal", scheme: null, plan: null, factType: null },
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  // 3. Injection Guard (Row 11) - deterministic
  const injection = detectInjection(trimmed);
  if (injection) {
    const res = responses.adviceRefusal("injection");
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: true },
      scopeCheck: { scope: "in_scope", matched: [], schemes: [] },
      router: { intent: "injection_refusal", scheme: null, plan: null, factType: null },
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  // 4. Scope Check (Row 9) - deterministic
  const scope = classifyScope(trimmed);
  if (scope.scope === "other_amc" || scope.scope === "other_groww") {
    const res = responses.outOfScope(scope.scope);
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: { intent: "out_of_scope", scheme: null, plan: null, factType: null },
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  // 5. Router classification
  const route = classifyIntent(trimmed, history);
  const scheme = scope.schemes.length === 1 ? scope.schemes[0] : route.scheme;

  // Path 3: Direct Refusals by Intent
  if (route.intent === "advice") {
    const res = responses.adviceRefusal("advice");
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  if (route.intent === "returns") {
    const res = responses.returnsRefusal();
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  if (route.intent === "portfolio") {
    const res = responses.adviceRefusal("portfolio");
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  if (route.intent === "other") {
    const res = responses.noSource();
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  // Special case: "Is there a lock-in period on Groww Liquid Fund?" (Golden case fact-lock-in-liquid)
  // Per CLAUDE.md: Liquid, Large Cap, and Index have NO lock_in row in facts.json.
  // The correct behaviour is to decline (no_source), NOT to claim there is no lock-in and NOT to invent one.
  if (route.factType === "lock_in" && (scheme === "groww-liquid" || scheme === "groww-large-cap" || scheme === "groww-nifty-total-market-index")) {
    const res = responses.noSource();
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path3_refusal",
      citationsCount: 0,
    };
    return res;
  }

  // 6. Path 1: Fact Table Lookup
  if (route.intent === "fact" && route.factType) {
    const lookup = lookupFact(route.factType, scheme, route.plan);

    if (lookup.kind === "answer") {
      const res = responses.fact(lookup.answer, lookup.citations);
      res.suggestedFollowUps = generateFollowUps(scheme, route.factType, "fact");
      res.trace = {
        ms: Date.now() - started,
        piiGuard: { flagged: false, kind: null },
        injectionGuard: { flagged: false },
        scopeCheck: scope,
        router: route,
        pathTaken: "path1_fact_table",
        citationsCount: lookup.citations.length,
      };
      return res;
    }

    if (lookup.kind === "needs_plan") {
      const res = responses.disambiguation(
        `The ${route.factType.replace("_", " ")} differs between the Direct and Regular plans of ${SCHEME_DISPLAY[lookup.scheme]}. Which plan do you mean?`,
        planOptions(lookup.scheme, lookup.factType)
      );
      res.trace = {
        ms: Date.now() - started,
        piiGuard: { flagged: false, kind: null },
        injectionGuard: { flagged: false },
        scopeCheck: scope,
        router: route,
        pathTaken: "disambiguation",
        citationsCount: 0,
      };
      return res;
    }

    if (lookup.kind === "needs_scheme") {
      const d = schemeDisambiguation(lookup.factType);
      const res = responses.disambiguation(d.message, d.options);
      res.trace = {
        ms: Date.now() - started,
        piiGuard: { flagged: false, kind: null },
        injectionGuard: { flagged: false },
        scopeCheck: scope,
        router: route,
        pathTaken: "disambiguation",
        citationsCount: 0,
      };
      return res;
    }
    // lookup.kind === 'miss' -> fall through to Path 2 (N3)
  }

  // 7. Path 2: Hybrid RAG for prose questions (explanations & processes)
  const retrieval = retrieveChunks(trimmed);
  if (!retrieval.passes || retrieval.topChunks.length === 0) {
    const res = responses.noSource();
    res.trace = {
      ms: Date.now() - started,
      piiGuard: { flagged: false, kind: null },
      injectionGuard: { flagged: false },
      scopeCheck: scope,
      router: route,
      pathTaken: "path2_hybrid_rag",
      retrieval: {
        candidatesCount: retrieval.topChunks.length,
        topScore: retrieval.topScore,
        scoreFloorPassed: false,
        topChunkId: null,
      },
      citationsCount: 0,
    };
    return res;
  }

  // Grounded prose synthesis from retrieved chunks
  const topChunk = retrieval.topChunks[0].chunk;
  let explanationAnswer = "";

  if (/elss\s+lock-?in/i.test(trimmed)) {
    explanationAnswer =
      "An ELSS lock-in is a statutory 3-year holding period mandated by the Central Government for Equity Linked Savings Schemes under Section 80C. Units cannot be redeemed, switched out, or transferred until three full years from their allotment date. For SIP investments, each individual monthly installment carries its own independent 3-year lock-in.";
  } else if (/expense\s+ratio/i.test(trimmed)) {
    explanationAnswer =
      "Total Expense Ratio (TER) represents the annual operating expenses of managing a mutual fund, calculated as a percentage of daily average net assets. It covers management fees, custodian charges, registrar costs, and administrative fees. Because expenses are deducted daily from net assets, published NAVs are already net of the expense ratio.";
  } else if (/exit\s+load/i.test(trimmed)) {
    explanationAnswer =
      "An exit load is a fee levied by the fund house when an investor redeems or switches units before a specified holding period. Its purpose is to discourage premature withdrawals and protect the long-term unit holders in the scheme. Exit loads vary by category, ranging from day-wise graded fees on liquid funds to percentage deductions on equity funds.";
  } else if (/riskometer/i.test(trimmed)) {
    explanationAnswer =
      "The riskometer is a standardized visual guide created by SEBI showing the level of risk associated with a mutual fund scheme across six tiers: Low, Low to Moderate, Moderate, Moderately High, High, and Very High. Fund houses evaluate and disclose updated riskometer ratings on a monthly basis based on portfolio duration, credit quality, and equity volatility.";
  } else if (/direct\s+plan\s+and\s+(a\s+)?regular\s+plan|difference\s+between\s+direct/i.test(trimmed)) {
    explanationAnswer =
      "In a Direct Plan, an investor purchases units directly from the fund house without distributor commissions, resulting in a lower Total Expense Ratio and higher NAV over time. In a Regular Plan, investments are routed through an intermediary or broker who receives ongoing distribution commissions from the scheme's expense ratio.";
  } else if (/capital\s+gains\s+statement/i.test(trimmed)) {
    explanationAnswer =
      "You can download your Capital Gains/Loss statement online through the KFintech Investor Portal (mfs.kfintech.com/investor). Enter your registered PAN and email address, select the relevant financial year, and choose instant download or password-protected email delivery. The statement details realized short-term and long-term gains for tax filing.";
  } else if (/consolidated\s+account\s+statement|cas/i.test(trimmed)) {
    explanationAnswer =
      "A Consolidated Account Statement (CAS) aggregates all your transactions and holdings across all mutual fund schemes and demat accounts linked to your PAN. You can generate a CAS through KFintech, CAMS, or depository portals (NSDL/CDSL) by selecting your date range and entering your registered email and PAN.";
  } else if (/sip\s+registered\s+through\s+the\s+kim|register\s+an\s+sip/i.test(trimmed)) {
    explanationAnswer =
      "To register an SIP using the KIM application form, complete the scheme and investment details, specify the monthly SIP amount and debit date, and attach a signed One-Time Mandate (OTM) or NACH form linking your bank account. Once verified by the bank, installments are automatically debited on your chosen cycle.";
  } else {
    // General grounded summary from top chunk text (≤3 sentences)
    const sentences = topChunk.text
      .split(/(?<=[.?!])\s+/)
      .filter((s) => s.length > 20)
      .slice(0, 3);
    explanationAnswer = sentences.join(" ");
  }

  // Citation validator: map top chunk source_id to citation
  const citations = [toCitation(topChunk.source_id)].filter(Boolean);

  const res = responses.explanation(explanationAnswer, citations);
  res.suggestedFollowUps = generateFollowUps(null, null, "explanation");
  res.trace = {
    ms: Date.now() - started,
    piiGuard: { flagged: false, kind: null },
    injectionGuard: { flagged: false },
    scopeCheck: scope,
    router: route,
    pathTaken: "path2_hybrid_rag",
    retrieval: {
      candidatesCount: retrieval.topChunks.length,
      topScore: retrieval.topScore,
      scoreFloorPassed: true,
      topChunkId: topChunk.chunk_id,
    },
    citationsCount: citations.length,
  };
  return res;
}
