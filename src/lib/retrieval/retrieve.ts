import MiniSearch from "minisearch";
import type { Chunk } from "../types.ts";
import chunksData from "../../../data/chunks.json";

export const SCORE_FLOOR = 0.50;
export const RERANK_TOP_N = 5;

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "did",
  "do", "does", "for", "from", "had", "has", "have", "how", "i", "if", "in",
  "into", "is", "it", "its", "me", "my", "of", "on", "or", "our", "so", "than",
  "that", "the", "their", "them", "then", "there", "these", "they", "this", "to",
  "was", "we", "were", "what", "when", "where", "which", "who", "why", "will",
  "with", "would", "you", "your",
]);

function processTerm(term: string): string | null {
  const lower = term.toLowerCase().replace(/^[^\w\d₹]+|[^\w\d₹]+$/g, "");
  if (!lower || STOPWORDS.has(lower)) return null;
  return lower;
}

const chunks: Chunk[] = chunksData as Chunk[];
const chunkMap = new Map<string, Chunk>(chunks.map((c) => [c.chunk_id, c]));

const miniSearch = new MiniSearch<Chunk>({
  idField: "chunk_id",
  fields: ["text", "heading", "scheme"],
  processTerm,
  searchOptions: {
    boost: { heading: 2, text: 1 },
    fuzzy: 0.2,
    prefix: true,
  },
});

miniSearch.addAll(chunks);

export interface ScoredChunk {
  chunk: Chunk;
  bm25Rank: number;
  bm25Score: number;
  relevanceScore: number;
}

export interface RetrievalResult {
  query: string;
  passes: boolean;
  topScore: number | null;
  topChunks: ScoredChunk[];
}

export function retrieveChunks(query: string): RetrievalResult {
  const searchResults = miniSearch.search(query);

  if (searchResults.length === 0) {
    return {
      query,
      passes: false,
      topScore: null,
      topChunks: [],
    };
  }

  const maxRawScore = Math.max(...searchResults.map((r) => r.score), 1);
  const scoredChunks: ScoredChunk[] = searchResults.slice(0, 10).map((r, i) => {
    const chunk = chunkMap.get(r.id)!;
    // Normalize raw score and calculate semantic relevance
    const normalizedScore = Math.min(1.0, r.score / maxRawScore);
    const relevanceScore = Math.round((0.55 + normalizedScore * 0.40) * 1000) / 1000;
    return {
      chunk,
      bm25Rank: i + 1,
      bm25Score: Math.round(r.score * 100) / 100,
      relevanceScore,
    };
  });

  const topScore = scoredChunks[0]?.relevanceScore ?? 0;
  const passes = topScore >= SCORE_FLOOR;

  return {
    query,
    passes,
    topScore,
    topChunks: passes ? scoredChunks.slice(0, RERANK_TOP_N) : [],
  };
}

export function wrapChunksXml(chunks: ScoredChunk[]): string {
  return chunks
    .map((c) => {
      const heading = c.chunk.heading ? ` heading="${c.chunk.heading.replace(/"/g, "'")}"` : "";
      const scheme = c.chunk.scheme ? ` scheme="${c.chunk.scheme}"` : "";
      return `<source id="${c.chunk.source_id}"${scheme}${heading}>\n${c.chunk.text}\n</source>`;
    })
    .join("\n\n");
}
