import type { SkillGap } from "@/lib/types";

let counter = 0;

export function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function pct(n: number): number {
  return Math.round(n * 100);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const PRIORITY_RANK: Record<SkillGap["priority"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const PRIORITY_LABEL: Record<SkillGap["priority"], string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const LEVEL_LABELS = ["None", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];

export const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function levelColor(level: number): string {
  if (level <= 0) return "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300";
  if (level <= 1) return "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
  if (level <= 2) return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300";
  if (level <= 3) return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  if (level <= 4) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  return "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";
}

export function levelHex(level: number): string {
  if (level <= 0) return "#a1a1aa";
  if (level <= 1) return "#f43f5e";
  if (level <= 2) return "#f97316";
  if (level <= 3) return "#f59e0b";
  if (level <= 4) return "#10b981";
  return "#0ea5e9";
}

export function difficultyRank(d: "beginner" | "intermediate" | "advanced"): number {
  return d === "beginner" ? 0 : d === "intermediate" ? 1 : 2;
}

export function estimatedWeeks(totalMinutes: number, weeklyHours: number): number {
  if (weeklyHours <= 0) return 1;
  const weeks = totalMinutes / (weeklyHours * 60);
  return Math.max(1, Math.round(weeks));
}

export function formatMinutes(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.round(minutes / 60);
    return `${h}h`;
  }
  return `${minutes}m`;
}

export function skillName(id: string): string {
  const map: Record<string, string> = {
    python: "Python",
    sql: "SQL",
    javascript: "JavaScript",
    html_css: "HTML/CSS",
    git: "Git",
    statistics: "Statistics",
    probability: "Probability",
    numpy: "NumPy",
    pandas: "Pandas",
    "machine-learning": "Machine Learning",
    "model-evaluation": "Model Evaluation",
    "deep-learning": "Deep Learning",
    "data-processing": "Data Processing",
    react: "React",
    api: "API Development",
    "data-visualization": "Data Visualization",
    "data-analysis": "Data Analysis",
    algorithms: "Algorithms & Data Structures",
    mlops: "MLOps / Deployment",
  };
  return map[id] ?? id;
}