import fs from "fs";
import path from "path";
import { processQuestion } from "../src/lib/pipeline.ts";
import { loadFacts } from "../src/lib/facts/lookup.ts";

const goldenRaw = fs.readFileSync(path.join(process.cwd(), "evals", "golden.json"), "utf-8");
const golden = JSON.parse(goldenRaw);
const facts = loadFacts();

let passed = 0;
const failures: any[] = [];

for (const c of golden.cases) {
  const response = processQuestion(c.question, c.history || []);
  const fails: string[] = [];

  if (response.answerType !== c.expect.answerType) {
    fails.push(`Expected answerType '${c.expect.answerType}', got '${response.answerType}'`);
  }

  if (c.expect.fact) {
    const rows = facts.filter(
      (r) =>
        r.scheme === c.expect.fact.scheme &&
        r.fact_type === c.expect.fact.fact_type &&
        (c.expect.fact.plan === null ? true : r.plan === c.expect.fact.plan)
    );
    if (rows.length === 0) {
      fails.push(`Missing fact row for ${c.expect.fact.scheme}/${c.expect.fact.fact_type}`);
    } else {
      for (const row of rows) {
        const val = row.value;
        if (row.fact_type === "lock_in" && val.toLowerCase() === "none") {
          if (!/no lock-in/i.test(response.answer)) {
            fails.push(`Answer missing lock-in value '${val}'`);
          }
        } else if (!response.answer.includes(val)) {
          fails.push(`Answer missing expected value '${val}'`);
        }
      }
      if (response.citations.length === 0) {
        fails.push("Fact response missing citations");
      }
    }
  }

  if (c.expect.optionCount !== undefined) {
    const count = response.disambiguationOptions?.length ?? 0;
    if (count !== c.expect.optionCount) {
      fails.push(`Expected ${c.expect.optionCount} disambiguation options, got ${count}`);
    }
  }

  if (c.expect.citedAtLeast !== undefined && response.citations.length < c.expect.citedAtLeast) {
    fails.push(`Expected at least ${c.expect.citedAtLeast} citations, got ${response.citations.length}`);
  }

  if (c.expect.educationalLink && !response.educationalLink) {
    fails.push("Missing educationalLink");
  }

  if (c.expect.answerMustNotMatch) {
    const re = new RegExp(c.expect.answerMustNotMatch, "i");
    if (re.test(response.answer)) {
      fails.push(`Answer matches forbidden pattern '${c.expect.answerMustNotMatch}'`);
    }
  }

  if (fails.length === 0) {
    passed++;
  } else {
    failures.push({ id: c.id, question: c.question, fails });
  }
}

console.log(`\n========================================`);
console.log(`Golden Test Suite Results: ${passed}/${golden.cases.length} PASSED (${Math.round((passed / golden.cases.length) * 100)}%)`);
console.log(`========================================\n`);

if (failures.length > 0) {
  console.log("FAILURES:");
  for (const f of failures) {
    console.log(`- [${f.id}] "${f.question}":`);
    for (const msg of f.fails) {
      console.log(`    ❌ ${msg}`);
    }
  }
}
