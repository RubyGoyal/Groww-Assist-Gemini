import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { processQuestion } from "./src/lib/pipeline.ts";
import { loadFacts } from "./src/lib/facts/lookup.ts";
import { SOURCE_REGISTRY_DATA } from "./src/lib/sources/registry.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API Endpoints

// 1. POST /api/ask - Primary Question Answering Endpoint
app.post("/api/ask", (req: Request, res: Response) => {
  try {
    const { question, history } = req.body;
    if (typeof question !== "string") {
      res.status(400).json({ error: "question must be a string." });
      return;
    }
    const response = processQuestion(question, Array.isArray(history) ? history : []);
    res.json(response);
  } catch (error: any) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: "Failed to process question." });
  }
});

// 2. GET /api/facts - Verified Fact Table (51 rows)
app.get("/api/facts", (_req: Request, res: Response) => {
  res.json(loadFacts());
});

// 3. GET /api/sources - 23 Official Source Documents
app.get("/api/sources", (_req: Request, res: Response) => {
  res.json(SOURCE_REGISTRY_DATA);
});

// 4. GET /api/eval - Live evaluation runner for the 40 golden cases
app.get("/api/eval", (_req: Request, res: Response) => {
  try {
    const goldenRaw = fs.readFileSync(path.join(process.cwd(), "evals", "golden.json"), "utf-8");
    const golden = JSON.parse(goldenRaw);
    const facts = loadFacts();

    const results = golden.cases.map((c: any) => {
      const start = Date.now();
      const response = processQuestion(c.question, c.history || []);
      const latencyMs = Date.now() - start;

      const fails: string[] = [];

      // Check answerType
      if (response.answerType !== c.expect.answerType) {
        fails.push(`Expected answerType '${c.expect.answerType}', got '${response.answerType}'`);
      }

      // Check fact value & citation
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

      // Check disambiguation options
      if (c.expect.optionCount !== undefined) {
        const count = response.disambiguationOptions?.length ?? 0;
        if (count !== c.expect.optionCount) {
          fails.push(`Expected ${c.expect.optionCount} disambiguation options, got ${count}`);
        }
      }

      // Check minimum citations
      if (c.expect.citedAtLeast !== undefined && response.citations.length < c.expect.citedAtLeast) {
        fails.push(`Expected at least ${c.expect.citedAtLeast} citations, got ${response.citations.length}`);
      }

      // Check educational link
      if (c.expect.educationalLink && !response.educationalLink) {
        fails.push("Missing educationalLink");
      }

      // Check forbidden patterns
      if (c.expect.answerMustNotMatch) {
        const re = new RegExp(c.expect.answerMustNotMatch, "i");
        if (re.test(response.answer)) {
          fails.push(`Answer matches forbidden pattern '${c.expect.answerMustNotMatch}'`);
        }
      }

      return {
        id: c.id,
        row: c.row,
        category: c.category,
        question: c.question,
        answerType: response.answerType,
        answer: response.answer,
        citationsCount: response.citations.length,
        latencyMs,
        passed: fails.length === 0,
        failures: fails,
      };
    });

    const categoryStats: Record<string, { total: number; passed: number; bar: number }> = {
      scheme_facts: { total: 16, passed: 0, bar: 1.0 },
      definitions_process: { total: 8, passed: 0, bar: 0.9 },
      paraphrase: { total: 6, passed: 0, bar: 0.85 },
      refusals: { total: 8, passed: 0, bar: 1.0 },
      out_of_corpus: { total: 2, passed: 0, bar: 1.0 },
    };

    for (const r of results) {
      if (categoryStats[r.category]) {
        if (r.passed) categoryStats[r.category].passed++;
      }
    }

    const totalPassed = results.filter((r: any) => r.passed).length;
    res.json({
      total: results.length,
      passed: totalPassed,
      rate: Math.round((totalPassed / results.length) * 100),
      categoryStats,
      cases: results,
    });
  } catch (error: any) {
    console.error("Eval error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === "production" && fs.existsSync(path.join(process.cwd(), "dist"));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Groww Assist server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
