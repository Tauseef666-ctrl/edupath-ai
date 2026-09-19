import type { LearnerProfile } from "@/lib/types";

export const DEMO_PROFILE: LearnerProfile = {
  id: "alex-demo",
  name: "Alex",
  targetRole: "machine-learning-engineer",
  experience: "Beginner/intermediate software developer — builds web apps and has started exploring data analysis.",
  weeklyHours: 8,
  learningPreferences: ["video", "hands-on", "structured"],
  bio: "A self-taught developer with strong programming foundations who wants to move into machine learning.",
  skills: [
    { skillId: "python", currentLevel: 4, evidenceType: "evidence-supported", confidence: 0.85, evidence: "Built a data analysis mini-project in Python." },
    { skillId: "sql", currentLevel: 4, evidenceType: "declared", confidence: 0.7, evidence: "Declared in onboarding; used for querying datasets." },
    { skillId: "javascript", currentLevel: 3, evidenceType: "declared", confidence: 0.6, evidence: "Declared in onboarding." },
    { skillId: "html_css", currentLevel: 4, evidenceType: "evidence-supported", confidence: 0.8, evidence: "Portfolio web application." },
    { skillId: "git", currentLevel: 3, evidenceType: "declared", confidence: 0.6, evidence: "Declared in onboarding." },
    { skillId: "statistics", currentLevel: 1, evidenceType: "inferred", confidence: 0.4, evidence: "Only basic descriptive statistics used in mini-project." },
    { skillId: "probability", currentLevel: 1, evidenceType: "inferred", confidence: 0.35, evidence: "Not referenced in any project or certification." },
    { skillId: "machine-learning", currentLevel: 1, evidenceType: "inferred", confidence: 0.35, evidence: "Introductory exposure only (AI fundamentals certification)." },
    { skillId: "deep-learning", currentLevel: 0, evidenceType: "inferred", confidence: 0.2, evidence: "No projects, certifications, or declared experience." },
  ],
  projects: [
    { id: "p1", title: "Portfolio web application", description: "A responsive portfolio site with project showcases and a contact form.", skills: ["html_css", "javascript", "git"] },
    { id: "p2", title: "Data analysis mini-project", description: "Analysed a sales dataset with Python and SQL: summaries, filters, and simple charts.", skills: ["python", "sql", "statistics"] },
  ],
  certifications: [
    { id: "c1", title: "AI Fundamentals (intro)", issuer: "Online course", skills: ["python", "machine-learning"] },
  ],
  updatedAt: new Date().toISOString(),
};

export const DEMO_ANSWER_KEYS = [
  "Statistics Checkpoint",
];

export function demoAnswersForStatistics(): Record<string, number> {
  return {
    "st-1": 1,
    "st-2": 3,
    "st-3": 2,
    "st-4": 0,
    "st-5": 1,
    "st-6": 0,
    "st-7": 0,
    "st-8": 3,
    "st-9": 1,
    "st-10": 1,
    "st-11": 1,
    "st-12": 2,
    "st-13": 1,
  };
}