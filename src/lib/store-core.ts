import type {
  AgentEvent,
  Assessment,
  AssessmentResult,
  JourneyState,
  LearnerProfile,
  LearningPlan,
  PlanChange,
  PlanDecision,
  TaskStatus,
} from "@/lib/types";
import { runJourneyAnalysis } from "@/lib/orchestrator";
import { evaluateAssessment } from "@/lib/agents/evaluation";
import { replan } from "@/lib/agents/adaptive";
import { buildPlan, planSummary } from "@/lib/agents/planning";
import { uid } from "@/lib/utils";

export function initialState(): JourneyState {
  return {
    profile: null,
    plan: null,
    skillGaps: [],
    gapAnalysisDone: false,
    assessmentResults: [],
    agentEvents: [],
    planChanges: [],
    demoMode: false,
  };
}

export function applyAnalysis(state: JourneyState, raw: LearnerProfile): JourneyState {
  const result = runJourneyAnalysis(raw);
  return {
    ...state,
    profile: result.profile,
    skillGaps: result.gaps,
    gapAnalysisDone: true,
    plan: result.plan,
    agentEvents: [...result.events, ...state.agentEvents],
  };
}

export function applyAssessment(
  state: JourneyState,
  assessment: Assessment,
  answers: Record<string, number | string>
): JourneyState {
  if (!state.profile) return state;
  const evalOut = evaluateAssessment(assessment, answers, state.profile.id);
  const result: AssessmentResult = evalOut.result;

  let plan: LearningPlan | null = state.plan;
  let events: AgentEvent[] = [...evalOut.events, ...state.agentEvents];
  let planChanges = state.planChanges;

  if (evalOut.decision === "adapt" && plan) {
    const adaptive = replan(plan, result, state.profile.weeklyHours);
    if (adaptive.change && adaptive.updatedPlan) {
      const proposed = adaptive.updatedPlan;
      plan = {
        ...plan,
        version: proposed.version,
        updatedAt: proposed.updatedAt,
        status: "needs-approval",
        pendingChange: adaptive.change,
        tasks: plan.tasks,
      };
      planChanges = [adaptive.change, ...state.planChanges];
      events = [...adaptive.events, ...events];
    }
  }

  return {
    ...state,
    plan,
    assessmentResults: [result, ...state.assessmentResults],
    agentEvents: events,
    planChanges,
  };
}

export function applyDecision(state: JourneyState, decision: PlanDecision): JourneyState {
  const plan = state.plan;
  if (!plan || !plan.pendingChange) return state;

  const pending = plan.pendingChange;
  const decidedAt = new Date().toISOString();
  const change: PlanChange = {
    ...pending,
    status: decision === "approve" ? "approved" : "rejected",
    decidedAt,
  };

  const applied: LearningPlan =
    decision === "approve"
      ? {
          ...plan,
          version: change.newVersion,
          status: "approved",
          updatedAt: decidedAt,
          pendingChange: undefined,
          tasks: change.proposedTasks ?? plan.tasks,
        }
      : {
          ...plan,
          version: change.previousVersion,
          status: "active",
          updatedAt: decidedAt,
          pendingChange: undefined,
          tasks: change.previousTasks ?? plan.tasks,
        };

  const events: AgentEvent[] =
    decision === "approve"
      ? [
          {
            id: uid("evt"),
            agent: "Orchestrator",
            action: "Approved roadmap update",
            status: "completed",
            summary: `Learner accepted plan version ${change.newVersion}. Journey now includes reinforcement before dependent modules.`,
            timestamp: decidedAt,
            metadata: { version: change.newVersion },
          },
          ...state.agentEvents,
        ]
      : [
          {
            id: uid("evt"),
            agent: "Orchestrator",
            action: "Kept current plan",
            status: "info",
            summary: "Learner chose to keep the current plan. The proposed reinforcement module was not applied.",
            timestamp: decidedAt,
            metadata: { version: change.previousVersion },
          },
          ...state.agentEvents,
        ];

  const planChanges = state.planChanges.some((c) => c.id === change.id)
    ? state.planChanges.map((c) => (c.id === change.id ? change : c))
    : [change, ...state.planChanges];

  return {
    ...state,
    plan: applied,
    planChanges,
    agentEvents: events,
  };
}

export function applyTaskStatus(
  state: JourneyState,
  taskId: string,
  status: TaskStatus
): JourneyState {
  if (!state.plan) return state;
  const tasks = state.plan.tasks.map((t) =>
    t.id === taskId ? { ...t, status } : t
  );

  return {
    ...state,
    plan: { ...state.plan, tasks, updatedAt: new Date().toISOString() },
  };
}

export function adjustWeeklyHours(state: JourneyState, hours: number): JourneyState {
  if (!state.profile || !state.plan) return state;
  const profile: LearnerProfile = {
    ...state.profile,
    weeklyHours: hours,
    updatedAt: new Date().toISOString(),
  };

  const resourcesBySkill: Record<string, never> = state.plan.tasks.reduce(
    (acc, t) => {
      if (t.resources.length > 0) {
        acc[t.skillId] = t.resources as never;
      }
      return acc;
    },
    {} as Record<string, never>
  );

  const rebuilt = buildPlan(profile, state.skillGaps, resourcesBySkill, state.plan);
  const plan: LearningPlan = {
    ...rebuilt.plan,
    status: state.plan.status === "needs-approval" ? "needs-approval" : "active",
    pendingChange: state.plan.pendingChange,
  };

  const event: AgentEvent = {
    id: uid("evt"),
    agent: "Planning Agent",
    action: "Rescheduled journey for new time budget",
    status: "completed",
    summary: `Adjusted the roadmap for ${hours} hours/week. ${planSummary(plan)}.`,
    timestamp: new Date().toISOString(),
    metadata: { weeklyHours: hours },
  };

  return {
    ...state,
    profile,
    plan,
    agentEvents: [event, ...state.agentEvents],
  };
}