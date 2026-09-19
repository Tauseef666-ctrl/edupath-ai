import type { ProfileSkill } from "@/lib/types";

const KEYWORD_MAP: Record<string, { skillId: string; hints: { level: number; weight: number }[] }> = {
  python: { skillId: "python", hints: [{ level: 3, weight: 0.5 }, { level: 4, weight: 1 }] },
  sql: { skillId: "sql", hints: [{ level: 3, weight: 1 }] },
  postgres: { skillId: "sql", hints: [{ level: 3, weight: 0.5 }] },
  mysql: { skillId: "sql", hints: [{ level: 3, weight: 0.5 }] },
  database: { skillId: "sql", hints: [{ level: 2, weight: 0.4 }] },
  javascript: { skillId: "javascript", hints: [{ level: 3, weight: 1 }] },
  typescript: { skillId: "javascript", hints: [{ level: 4, weight: 0.8 }] },
  react: { skillId: "react", hints: [{ level: 3, weight: 1 }] },
  html: { skillId: "html_css", hints: [{ level: 3, weight: 0.8 }] },
  css: { skillId: "html_css", hints: [{ level: 3, weight: 0.8 }] },
  git: { skillId: "git", hints: [{ level: 3, weight: 1 }] },
  github: { skillId: "git", hints: [{ level: 3, weight: 0.5 }] },
  "machine learning": { skillId: "machine-learning", hints: [{ level: 2, weight: 1 }] },
  "data science": { skillId: "machine-learning", hints: [{ level: 2, weight: 0.5 }] },
  "deep learning": { skillId: "deep-learning", hints: [{ level: 2, weight: 1 }] },
  statistics: { skillId: "statistics", hints: [{ level: 2, weight: 1 }] },
  probability: { skillId: "probability", hints: [{ level: 2, weight: 1 }] },
  numpy: { skillId: "numpy", hints: [{ level: 3, weight: 1 }] },
  pandas: { skillId: "pandas", hints: [{ level: 3, weight: 1 }] },
  "model evaluation": { skillId: "model-evaluation", hints: [{ level: 2, weight: 1 }] },
  "cross-validation": { skillId: "model-evaluation", hints: [{ level: 3, weight: 0.8 }] },
  "data processing": { skillId: "data-processing", hints: [{ level: 3, weight: 1 }] },
  etl: { skillId: "data-processing", hints: [{ level: 3, weight: 0.6 }] },
  "data visualization": { skillId: "data-visualization", hints: [{ level: 3, weight: 1 }] },
  matplotlib: { skillId: "data-visualization", hints: [{ level: 3, weight: 0.8 }] },
  api: { skillId: "api", hints: [{ level: 3, weight: 1 }] },
  rest: { skillId: "api", hints: [{ level: 3, weight: 0.6 }] },
  "algorithms": { skillId: "algorithms", hints: [{ level: 3, weight: 1 }] },
};

export function parseResumeText(text: string): ProfileSkill[] {
  const lower = text.toLowerCase();
  const found = new Map<string, ProfileSkill>();

  for (const [keyword, config] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      if (found.has(config.skillId)) continue;
      const hint = config.hints.reduce((best, h) => (h.weight > best.weight ? h : best));
      found.set(config.skillId, {
        skillId: config.skillId,
        currentLevel: hint.level,
        evidenceType: "evidence-supported",
        confidence: hint.weight,
        evidence: `Extracted from resume: mentions “${keyword}”.`,
      });
    }
  }

  const ctxMatches = ["experience", "project", "develop", "build", "intern", "engineer", "role"];

  return Array.from(found.values()).map((s) => {
    if (ctxMatches.some((c) => lower.includes(c))) {
      s.confidence = Math.min(1, s.confidence + 0.15);
    }
    return s;
  });
}

export function resumeMatches(text: string): string[] {
  return Object.entries(KEYWORD_MAP)
    .filter(([k]) => text.toLowerCase().includes(k))
    .map(([, c]) => c.skillId);
}