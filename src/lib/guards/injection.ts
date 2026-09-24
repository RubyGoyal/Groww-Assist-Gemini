const PATTERNS: RegExp[] = [
  /\bignore\b.{0,40}\b(instructions?|rules?|prompt|guidelines?)\b/i,
  /\bdisregard\b.{0,40}\b(instructions?|rules?|prompt|guidelines?)\b/i,
  /\b(forget|override|bypass)\b.{0,40}\b(instructions?|rules?|prompt|guidelines?|restrictions?)\b/i,
  /\b(system|developer)\s+(prompt|message|mode)\b/i,
  /\b(reveal|show|print|repeat)\b.{0,30}\b(your|the)\s+(instructions?|prompt|rules?)\b/i,
  /\byou are now\b/i,
  /\b(pretend|act as|roleplay as)\b.{0,40}\b(unrestricted|without (any )?(rules|restrictions)|different (ai|assistant))\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b/,
];

export function detectInjection(text: string): boolean {
  return PATTERNS.some((re) => re.test(text));
}
