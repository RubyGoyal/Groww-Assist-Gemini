export type AnswerType =
  | "fact"
  | "explanation"
  | "disambiguation"
  | "advice_refusal"
  | "pii_refusal"
  | "out_of_scope"
  | "no_source";

export type FactType =
  | "expense_ratio"
  | "exit_load"
  | "lock_in"
  | "min_sip"
  | "min_lumpsum"
  | "benchmark"
  | "riskometer"
  | "fund_manager"
  | "category";

export type Plan = "direct" | "regular";

export interface Citation {
  title: string;
  url: string;
  publisher: string;
  docType: string;
  sourceEffectiveDate: string | null;
  retrievedAt: string;
}

export interface DisambiguationOption {
  label: string;
  question: string;
}

export interface AskResponse {
  answerType: AnswerType;
  answer: string;
  citations: Citation[];
  disambiguationOptions: DisambiguationOption[] | null;
  educationalLink: string | null;
  corpusVersion: string;
  disclaimer: string;
  suggestedFollowUps?: string[];
  trace?: PipelineTrace;
}

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface FactRow {
  scheme: string;
  plan: Plan | null;
  varies_by_plan: boolean;
  fact_type: FactType;
  value: string;
  qualifier: string | null;
  source_id: string;
  source_effective_date: string;
  fetched_at: string;
  verified_by: string | null;
}

export interface SourceRow {
  id: string;
  landing_url: string;
  document_url: string;
  title: string;
  publisher: string;
  scheme: string;
  plan: string;
  doc_type: string;
  fetched_at: string;
  source_effective_date: string;
}

export interface Chunk {
  chunk_id: string;
  source_id: string;
  scheme: string | null;
  plan: string | null;
  heading: string | null;
  text: string;
}

export interface PipelineTrace {
  ms: number;
  piiGuard: { flagged: boolean; kind: string | null };
  injectionGuard: { flagged: boolean };
  scopeCheck: { scope: string; matched: string[]; schemes: string[] };
  router: { intent: string; scheme: string | null; plan: Plan | null; factType: FactType | null };
  pathTaken: "path1_fact_table" | "path2_hybrid_rag" | "path3_refusal" | "disambiguation";
  retrieval?: {
    candidatesCount: number;
    topScore: number | null;
    scoreFloorPassed: boolean;
    topChunkId: string | null;
  };
  citationsCount: number;
}
