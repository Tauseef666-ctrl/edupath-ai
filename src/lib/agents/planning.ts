import type {
  AgentEvent,
  LearnerProfile,
  LearningPlan,
  LearningTask,
  Resource,
  SkillGap,
} from "@/lib/types";
import { SKILLS, SKILL_DEPENDENCIES } from "@/lib/data/roles";
import { ASSESSMENTS } from "@/lib/data/assessments";
import { DIFFICULTY_LABEL, PRIORITY_RANK, formatMinutes, uid } from "@/lib/utils";

export interface PlanningOutput {
  plan: LearningPlan;
  events: AgentEvent[];
  orderedSkillIds: string[];
}

function topoSort(skillIds: string[]): string[] {
  const present = new Set(skillIds);
  const adj = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (const id of skillIds) {
    adj.set(id, []);
    indegree.set(id, 0);
  }
  for (const dep of SKILL_DEPENDENCIES) {
    if (present.has(dep.from) && present.has(dep.to)) {
      adj.get(dep.from)!.push(dep.to);
      indegree.set(dep.to, (indegree.get(dep.to) ?? 0) + 1);
    }
  }
  const done = new Set<string>();
  const order: string[] = [];
  while (order.length < skillIds.length) {
    const ready = skillIds.filter((id) => !done.has(id) && indegree.get(id) === 0);
    if (ready.length === 0) break;
    const pick = ready.reduce((best, id) =>
      skillIds.indexOf(id) < skillIds.indexOf(best) ? id : best
    );
    done.add(pick);
    order.push(pick);
    for (const next of adj.get(pick)!) {
      indegree.set(next, (indegree.get(next) ?? 0) - 1);
    }
  }
  return order.length === skillIds.length ? order : skillIds;
}

function buildTasksForSkill(
  skillId: string,
  gap: SkillGap,
  resources: Resource[],
  week: number,
  stage: "learn" | "relearn"
): LearningTask[] {
  const skill = SKILLS[skillId];
  const tasks: LearningTask[] = [];
  const baseMinutes =
    resources.reduce((s, r) => s + r.durationMinutes, 0) + (stage === "learn" ? 90 : 120);
  const practiceMinutes = Math.min(150, 45 + resources.length * 25);
  const assessment = ASSESSMENTS[skillId];

  const diffLabels = resources.map((r) => DIFFICULTY_LABEL[r.difficulty]).join(", ");

  tasks.push({
    id: uid("task"),
    skillId,
    week,
    title: `${skill.name} Fundamentals`,
    objective: `Understand ${skill.description.replace(/\.$/, "")} well enough to apply it in a real workflow.`,
    resources,
    practice: [
      `Follow the ${resources.length} selected resources (${diffLabels}).`,
      "Take notes and rewrite each key idea in your own words.",
      "Solve at least 3 practice problems from the material.",
    ],
    estimatedMinutes: baseMinutes,
    status: "pending",
    kind: stage === "learn" ? "learn" : "relearn",
  });

  tasks.push({
    id: uid("task"),
    skillId,
    week,
    title: `${skill.name} Practice`,
    objective: `Apply ${skill.name} to hands-on exercises to build durable understanding.`,
    resources: [],
    practice: [
      "Do the structured exercises attached to the module resources.",
      "Build a small runnable example end-to-end on your own.",
      "Benchmark yourself against the module's learning objectives.",
    ],
    estimatedMinutes: practiceMinutes,
    status: "pending",
    kind: "practice",
  });

  if (assessment) {
    tasks.push({
      id: uid("task"),
      skillId,
      week,
      title: assessment.title,
      objective: `Verify understanding of ${skill.name} before moving on.`,
      resources: [],
      practice: [],
      estimatedMinutes: 20,
      status: "pending",
      kind: stage === "relearn" ? "reassessment" : "assessment",
      assessmentId: assessment.id,
    });
  }

  return tasks;
}

export function buildPlan(
  profile: LearnerProfile,
  gaps: SkillGap[],
  resourcesBySkill: Record<string, Resource[]>,
  existing?: LearningPlan
): PlanningOutput {
  const events: AgentEvent[] = [];

  const gapped = gaps.filter((g) => g.gap > 0);
  const skillIds = gapped
    .slice()
    .sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority])
    .map((g) => g.skillId);

  const ordered = topoSort(skillIds);

  const tasks: LearningTask[] = [];
  const weeksPerSkill: Record<string, number> = {};
  const weeklyMinutes = profile.weeklyHours * 60;
  let week = 1;
  let weekLoad = 0;

  for (const skillId of ordered) {
    const gap = gapped.find((g) => g.skillId === skillId)!;
    const resources = resourcesBySkill[skillId] ?? [];
    const moduleTasks = buildTasksForSkill(skillId, gap, resources, week, "learn");
    const minutes = moduleTasks.reduce((s, t) => s + t.estimatedMinutes, 0);

    if (weekLoad > 0 && weekLoad + minutes > weeklyMinutes) {
      week += 1;
      weekLoad = 0;
    }
    moduleTasks.forEach((t) => (t.week = week));
    weeksPerSkill[skillId] = week;
    tasks.push(...moduleTasks);
    weekLoad += minutes;
  }

  const now = new Date().toISOString();
  const prevVersion = existing?.version ?? 0;

  const plan: LearningPlan = {
    id: existing?.id ?? uid("plan"),
    profileId: profile.id,
    version: prevVersion + 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    status: "active",
    weeksPerSkill,
    tasks,
  };

  events.push({
    id: uid("evt"),
    agent: "Planning Agent",
    action: "Generated personalized roadmap",
    status: "completed",
    summary: `Built a ${ordered.length}-module roadmap across ${week} week${week > 1 ? "s" : ""}, ordered by skill dependencies and gap priority.`,
    timestamp: now,
    metadata: { modules: ordered.length, weeks: week, version: plan.version },
  });

  return { plan, events, orderedSkillIds: ordered };
}

export function pathOf(plan: LearningPlan): string[] {
  const seen: string[] = [];
  for (const t of plan.tasks) {
    if (t.kind !== "learn" && t.kind !== "relearn") continue;
    if (!seen.includes(t.skillId)) seen.push(t.skillId);
  }
  return seen.map((id) => SKILLS[id]?.name ?? id);
}

export function completionOf(plan: LearningPlan): number {
  if (plan.tasks.length === 0) return 0;
  const done = plan.tasks.filter((t) => t.status === "completed").length;
  return Math.round((done / plan.tasks.length) * 100);
}

export function inProgressSkills(plan: LearningPlan): string[] {
  return plan.tasks
    .filter((t) => t.status === "in-progress" || t.status === "pending")
    .map((t) => t.skillId);
}

export function firstIncomplete(plan: LearningPlan): LearningTask | undefined {
  return plan.tasks.find((t) => t.status === "pending" || t.status === "in-progress");
}

export function taskMinutes(plan: LearningPlan): number {
  return plan.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
}

export function planSummary(plan: LearningPlan): string {
  const total = taskMinutes(plan);
  const modules = new Set(plan.tasks.filter((t) => t.kind === "learn").map((t) => t.skillId));
  return `${modules.size} modules · ${Math.max(1, plan.tasks.at(-1)?.week ?? 1)} weeks · ≈${formatMinutes(total)} of work`;
}