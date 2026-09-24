export interface PiiResult {
  flagged: boolean;
  kind: "pan" | "email" | "aadhaar" | "phone" | "keyword_number" | null;
}

const PAN_RE = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const CURRENCY_MARK = /(₹|\bRs\.?|\bINR)\s*$/i;
const KEYWORDS = /\b(otp|pan|aadhaar|aadhar|folio|account\s*number|a\/c\s*no|card)\b/i;

function isCurrencyMarked(text: string, index: number): boolean {
  return CURRENCY_MARK.test(text.slice(Math.max(0, index - 6), index));
}

export function detectPii(text: string): PiiResult {
  if (PAN_RE.test(text)) return { flagged: true, kind: "pan" };
  if (EMAIL_RE.test(text)) return { flagged: true, kind: "email" };

  const hasKeyword = KEYWORDS.test(text);
  const runRe = /\d[\d\s-]*\d/g;
  let m: RegExpExecArray | null;

  while ((m = runRe.exec(text)) !== null) {
    const digits = m[0].replace(/[\s-]/g, "");
    const marked = isCurrencyMarked(text, m.index);
    if (digits.length === 12 && !marked) return { flagged: true, kind: "aadhaar" };
    if (digits.length === 10 && !marked) return { flagged: true, kind: "phone" };
    if (digits.length >= 4 && digits.length <= 6) continue; // N1: never flagged
    if (hasKeyword && !marked) return { flagged: true, kind: "keyword_number" };
  }

  return { flagged: false, kind: null };
}
