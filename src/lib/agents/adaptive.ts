import type {
  AgentEvent,
  AssessmentResult,
  LearningPlan,
  LearningTask,
  PlanChange,
  Resource,
} from "@/lib/types";
import { ASSESSMENTS } from "@/lib/data/assessments";
import { pickResources } from "@/lib/data/resources";
import { SKILLS } from "@/lib/data/roles";
import { DIFFICULTY_LABEL, uid } from "@/lib/utils";
import { pathOf } from "@/lib/agents/planning";

export const CONCEPT_REINFORCEMENT: Record<
  string,
  { skillId: string; label: string }
> = {
  "mean-variance": { skillId: "statistics", label: "Mean & Variance Refresher" },
  "probability": { skillId: "probability", label: "Probability Foundations" },
  "conditional-probability": { skillId: "probability", label: "Conditional Probability & Bayes" },
  "distributions": { skillId: "probability", label: "Probability Distributions" },
  "interpretation": { skillId: "statistics", label: "Statistical Interpretation" },
  "supervised-learning": { skillId: "machine-learning", label: "Supervised Learning Refresher" },
  "training": { skillId: "machine-learning", label: "Training & Workflow Refresher" },
  "overfitting": { skillId: "machine-learning", label: "Overfitting Refresher" },
  "features": { skillId: "data-processing", label: "Feature Preparation Refresher" },
  "splits": { skillId: "model-evaluation", label: "Data Splits Refresher" },
  "metrics": { skillId: "model-evaluation", label: "Metrics Refresher" },
  "validation": { skillId: "model-evaluation", label: "Validation Refresher" },
  "basics": { skillId: "python", label: "Python Basics Refresher" },
  "functions": { skillId: "python", label: "Python Functions Refresher" },
  "dataframe": { skillId: "pandas", label: "DataFrame Refresher" },
  "operations": { skillId: "pandas", label: "Pandas Operations Refresher" },
};

export interface AdaptiveOutput {
  change: PlanChange | null;
  updatedPlan: LearningPlan | null;
  events: AgentEvent[];
}

function reinforcementTask(
  skillId: string,
  label: string,
  resources: Resource[],
  week: number
): LearningTask {
  const skill = SKILLS[skillId];
  const diffLabels = resources.map((r) => DIFFICULTY_LABEL[r.difficulty]).join(", ");
  return {
    id: uid("task"),
    skillId,
    week,
    title: label,
    objective: `Close the specific gap in ${skill.name} that the assessment surfaced, using targeted reinforcement material.`,
    resources,
    practice: [
      `Work through the reinforcement resources (${diffLabels}).`,
      "Re-attempt the practice problems you missed.",
      "Explain the concept aloud in your own words until it is fluent.",
    ],
    estimatedMinutes: Math.max(120, resources.reduce((s, r) => s + r.durationMinutes, 0) + 60),
    status: "pending",
    kind: "relearn",
  };
}

function reassessmentTask(
  assessmentId: string,
  skillId: string,
  week: number,
  label = "Reassessment"
): LearningTask {
  return {
    id: uid("task"),
    skillId,
    week,
    title: `${label}: verified with a checkpoint`,
    objective: `Re-verify understanding after the reinforcement module before continuing.`,
    resources: [],
    practice: [],
    estimatedMinutes: 20,
    status: "pending",
    kind: "reassessment",
    assessmentId,
  };
}

function renumberWeeks(tasks: LearningTask[], weeklyHours: number): void {
  const weeklyMinutes = weeklyHours * 60;
  let week = 1;
  let load = 0;
  for (const t of tasks) {
    if (load > 0 && load + t.estimatedMinutes > weeklyMinutes) {
      week += 1;
      load = 0;
    }
    t.week = week;
    load += t.estimatedMinutes;
  }
}

export function replan(
  plan: LearningPlan,
  result: AssessmentResult,
  weeklyHours: number
): AdaptiveOutput {
  const events: AgentEvent[] = [];
  const assessment =
    ASSESSMENTS[result.assessmentId] ??
    Object.values(ASSESSMENTS).find((a) => a.id === result.assessmentId);

  if (result.status !== "needs-reinforcement" || !assessment) {
    events.push({
      id: uid("evt"),
      agent: "Planning Agent",
      action: "No plan change needed",
      status: "completed",
      summary: "Learner evidence meets the current module's threshold — continuing with the existing journey.",
      timestamp: new Date().toISOString(),
    });
    return { change: null, updatedPlan: null, events };
  }

  const copy = plan.tasks.map((t) => ({ ...t }));
  const targetIndex = copy.findIndex(
    (t) => t.assessmentId === result.assessmentId && (t.kind === "assessment" || t.kind === "reassessment")
  );
  const at = targetIndex >= 0 ? targetIndex + 1 : copy.length;

  const inserted: LearningTask[] = [];
  const weekGuess = copy[Math.max(0, at - 1)]?.week ?? 1;

  for (const concept of result.weakConcepts) {
    const map = CONCEPT_REINFORCEMENT[concept];
    if (!map) continue;
    const required = assessment.skillId === "statistics" ? 4 : 3;
    const difficulty =
      required <= 2 ? "beginner" : required <= 4 ? "intermediate" : "advanced";
    const resources = pickResources(map.skillId, difficulty, 3);
    inserted.push(reinforcementTask(map.skillId, map.label, resources, weekGuess + inserted.length));
  }

  let continueAssessment: LearningTask | undefined;
  if (inserted.length > 0) {
    const skillLabel = SKILLS[assessment.skillId]?.name ?? "Module";
    continueAssessment = reassessmentTask(
      assessment.id,
      assessment.skillId,
      weekGuess + inserted.length,
      `${skillLabel} Reassessment`
    );
    inserted.push(continueAssessment);
  }

  const updated = [...copy.slice(0, at), ...inserted, ...copy.slice(at)];
  renumberWeeks(updated, weeklyHours);

  const previousPath = pathOf(plan);
  const updatedPath = updated
    .filter((t) => t.kind === "learn" || t.kind === "relearn" || t.kind === "reassessment")
    .map((t) => {
      if (t.kind === "reassessment") return "Reassessment";
      if (t.kind === "relearn") return t.title.replace(/ Fundamentals$/, "");
      return SKILLS[t.skillId]?.name ?? t.skillId;
    })
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const newVersion = plan.version + 1;
  const change: PlanChange = {
    id: uid("chg"),
    trigger: "assessment",
    status: "pending",
    reason:
      "Your recent assessment showed difficulty with one or more core concepts in this module. Advanced topics depend on these foundations, so EduPath inserted targeted reinforcement and a re-check before you move on.",
    evidence: [
      `${assessment.title} score: ${result.score}%`,
      `Weak concepts detected: ${result.weakConcepts.join(", ")}`,
      `Module status: ${result.status === "needs-reinforcement" ? "needs reinforcement" : "passed"}`,
    ],
    previousVersion: plan.version,
    newVersion,
    summary: `Insert ${inserted.length} reinforcement task${inserted.length > 1 ? "s" : ""} before the next module.`,
    previousPath,
    updatedPath,
    previousTasks: plan.tasks,
    proposedTasks: updated,
    createdAt: new Date().toISOString(),
  };

  const updatedPlan: LearningPlan = {
    ...plan,
    version: newVersion,
    updatedAt: new Date().toISOString(),
    status: "needs-approval",
    pendingChange: change,
    tasks: updated,
  };

  events.push({
    id: uid("evt"),
    agent: "Adaptive Agent",
    action: "Prepared adaptive replan",
    status: "completed",
    summary: change.summary,
    timestamp: change.createdAt,
    metadata: { version: newVersion, weakConcepts: result.weakConcepts },
  });

  events.push({
    id: uid("evt"),
    agent: "Planning Agent",
    action: "Updated learning journey",
    status: "completed",
    summary: "Roadmap version " + newVersion + " proposed with reinforcement inserted before dependent modules.",
    timestamp: change.createdAt,
    metadata: { version: newVersion },
  });

  return { change, updatedPlan, events };
}