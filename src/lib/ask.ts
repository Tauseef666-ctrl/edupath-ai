import type { JourneyState } from "@/lib/types";
import { SKILL_DEPENDENCIES, SKILLS, ROLES } from "@/lib/data/roles";
import { RESOURCES } from "@/lib/data/resources";
import { firstIncomplete, completionOf, pathOf } from "@/lib/agents/planning";
import { formatMinutes } from "@/lib/utils";

export interface AssistantReply {
  answer: string;
  intent: string;
  suggestedNext?: string[];
}

function gapsList(state: JourneyState): string {
  if (state.skillGaps.length === 0) return "No skill-gap analysis yet — run your profile analysis first.";
  const top = state.skillGaps
    .filter((g) => g.gap > 0)
    .slice(0, 5)
    .map((g) => `${g.skill.name} (-${g.gap}/5)`)
    .join(", ");
  return top;
}

export function answerQuestion(state: JourneyState, raw: string): AssistantReply {
  const q = raw.toLowerCase();

  if (/\bwhy\b.*\b(change|updated|roadmap|journey|replan)/.test(q)) {
    const change =
      state.planChanges.find((c) => c.status === "approved" || c.status === "pending") ??
      state.plan?.pendingChange ??
      state.planChanges[0];
    if (!change) {
      return {
        intent: "roadmap-why",
        answer:
          "Your journey hasn't been changed based on assessment evidence yet. Do an assessment and if the Evaluation Agent detects a weakness, EduPath will propose an updated path — and explain exactly why, here.",
        suggestedNext: ["Take the Statistics Checkpoint", "What should I learn this week?"],
      };
    }
    const statusLine =
      change.status === "pending"
        ? "You can still accept or reject this update — nothing changes until you decide."
        : change.status === "approved"
          ? "This update has been applied to your journey."
          : "You chose to keep your current plan, so this proposal was not applied.";
    return {
      intent: "roadmap-why",
      answer: `Here is why your roadmap was updated.\n\nRecommendation:\n${change.summary}\n\nReason:\n${change.reason}\n\nEvidence:\n${change.evidence.map((e) => `• ${e}`).join("\n")}\n\nPrevious path:\n${change.previousPath.join(" → ")}\n\nUpdated path:\n${change.updatedPath.join(" → ")}\n\n${statusLine}`,
      suggestedNext: ["What changed exactly?", "What should I learn this week?"],
    };
  }

  if (/what.*(change|changed)|what.*different/.test(q)) {
    const change = state.plan?.pendingChange ?? state.planChanges.find((c) => c.status === "approved");
    if (!change) {
      return { intent: "what-changed", answer: "Nothing has changed yet. Your roadmap is still the original plan built from your profile analysis." };
    }
    return {
      intent: "what-changed",
      answer: `The updated journey inserts reinforcement before the next module.\n\nBefore:\n${change.previousPath.join(" → ")}\n\nAfter:\n${change.updatedPath.join(" → ")}\n\nThe change was triggered because: ${change.reason}`,
    };
  }

  if (/only.*(\d+).*hours|adjust.*plan|less time|more time|weekly ?(hours|budget)/.test(q)) {
    return {
      intent: "adjust-hours",
      answer: `You can change your weekly time budget in the Profile page — set a new hours/week value and EduPath will reschedule the whole roadmap (compressing or stretching weeks) without changing what you learn.\n\nTimescale rule: total effort stays the same; fewer hours per week = more calendar weeks.`,
      suggestedNext: ["What should I learn this week?", "How close am I to my target?"],
    };
  }

  if (/what.*(learn|do).*(this|next).*week|this week/.test(q)) {
    const plan = state.plan;
    if (!plan) return { intent: "this-week", answer: "Your journey hasn't been built yet. Complete onboarding so I can tell you what to learn each week." };
    const task = firstIncomplete(plan);
    if (!task) return { intent: "this-week", answer: "You've completed all tasks in the current journey. Time for a new target or a capstone project!" };
    const resources = task.resources.map((r) => `• ${r.title} (${formatMinutes(r.durationMinutes)})`).join("\n");
    const next = plan.tasks.find((t) => t.week === task.week && t.id !== task.id);
    return {
      intent: "this-week",
      answer: `This week (Week ${task.week}) your focus is: ${task.title}\n\nObjective:\n${task.objective}\n\nResources:\n${resources || "• No external resources — complete the practice items."}\n\nPractice:\n${task.practice.map((p) => `• ${p}`).join("\n")}\n${next ? `\nAlso this week: "${next.title}".` : ""}`,
      suggestedNext: ["What is my biggest skill gap?", "Which resources should I use?"],
    };
  }

  if (/biggest|largest|most important.*gap|gap.*priorit/.test(q)) {
    const gaps = state.skillGaps.filter((g) => g.gap > 0);
    if (gaps.length === 0) return { intent: "biggest-gap", answer: "No gaps on record. Run your profile analysis to see the biggest skill gaps for your target role." };
    const top = gaps[0];
    return {
      intent: "biggest-gap",
      answer: `Your biggest gap is ${top.skill.name}.\n\nCurrent: ${top.currentLevel}/5\nRequired: ${top.requiredLevel}/5\nGap: ${top.gap}/5\nPriority: ${top.priority}\n\nReason:\n${top.reason}\n\nRecommended resources:\n${RESOURCES.filter((r) => r.skillId === top.skillId).slice(0, 2).map((r) => `• ${r.title}`).join("\n") || "• none available"}`,
      suggestedNext: ["What skills am I missing?", "What should I learn next?"],
    };
  }

  if (/missing|what.*skill|gap.*list|far.*target/.test(q)) {
    if (!state.profile) return { intent: "missing", answer: "Run onboarding first so I can compare your skills to a target role." };
    const gaps = state.skillGaps.filter((g) => g.gap > 0);
    const missing = gaps.filter((g) => g.currentLevel === 0);
    const progress = state.plan ? completionOf(state.plan) : 0;
    return {
      intent: "missing",
      answer: `For a ${ROLES[state.profile.targetRole]?.label ?? state.profile.targetRole} role you're ${progress}% through the plan.\n\nNotable gaps:\n${gapsList(state)}\n\n${missing.length > 0 ? `Skills you have no signal for yet: ${missing.map((g) => g.skill.name).join(", ")}.` : "You have at least some baseline in every required skill."}\n\nFirst priority: ${gaps[0]?.skill.name ?? "n/a"}.`,
      suggestedNext: ["How close am I to my target?", "Why do I need statistics?"],
    };
  }

  if (/how.*close|progress|far.*(away|from)|ready/.test(q)) {
    const plan = state.plan;
    if (!plan) return { intent: "closeness", answer: "No learning plan yet — run onboarding to measure how close you are to your target role." };
    const done = completionOf(plan);
    const remainingWeeks = plan.tasks.at(-1)?.week ?? 0;
    return {
      intent: "closeness",
      answer: `You've completed ${done}% of the current journey tasks. With your available time, the remaining roadmap spans about ${remainingWeeks} week${remainingWeeks === 1 ? "" : "s"}. Keep the adaptive loop going — assessments tell us whether to advance or reinforce.`,
      suggestedNext: ["Take the Statistics Checkpoint", "What should I learn next?"],
    };
  }

  if (/why.*(statistics|stats)\b/.test(q)) {
    return {
      intent: "why-statistics",
      answer: `Statistics is the mathematical foundation of machine learning. Models estimate parameters, sample from data, and report uncertainty — all built on variance, distributions, and hypothesis testing.\n\nFor a Machine Learning Engineer role you need ~4/5, and it's a prerequisite for Probability → Machine Learning. Teaching advanced ML without this base would leave permanent gaps.\n\nEvidence: your assessment on this module directly determines whether EduPath advances or inserts reinforcement.`,
      suggestedNext: ["What is my biggest skill gap?", "What should I learn this week?"],
    };
  }

  if (/why.*(probab|bayes)\b/.test(q)) {
    return {
      intent: "why-probability",
      answer: `Probability is the language of uncertainty. Machine learning algorithms — including classification and neural networks — are fundamentally probabilistic (likelihood, priors, softmax).\n\nWithout conditional probability and distributions, model outputs become magic instead of math.\n\nEvidence: the Statistics Checkpoint specifically surfaces weaknesses in probability before letting you proceed.`,
      suggestedNext: ["Why do I need statistics?", "Take the Statistics Checkpoint"],
    };
  }

  if (/project|build|capstone|after.*(roadmap|plan)/.test(q)) {
    return {
      intent: "project",
      answer: `After this roadmap, build an end-to-end ML project to prove the whole loop:\n\n• Pick a real dataset (Kaggle is fine)\n• Do EDA and data processing\n• Train and evaluate 2–3 models with cross-validation\n• Deploy a small endpoint or notebook\n• Write up the decisions and metrics\n\nThat single project covers most of the Machine Learning Engineer requirements (data-processing, modeling, model-evaluation) and becomes evidence in your profile.`,
      suggestedNext: ["What is my biggest skill gap?", "Which resources should I use?"],
    };
  }

  if (/(best|top|good|which|great|how).*resource|resource.*(for|to learn)|study material|(best|how).*(course|book|tutorial)/.test(q)) {
    const wanted = findSkillId(
      Object.keys(SKILLS).find((id) => new RegExp(`\\b${SKILLS[id]?.name.toLowerCase().replace(/[^a-z-]+/g, "|")}\\b`).test(q)) ??
        q.replace(/.*resource.*?(for|on)?\s*/i, "")
    );
    const used = wanted ?? state.skillGaps.filter((g) => g.gap > 0)[0]?.skill.id ?? q.replace(/[^a-z-]+/g, " ");
    const matches = RESOURCES.filter((r) => r.skillId === used).sort((a, b) => a.difficulty.localeCompare(b.difficulty)).slice(0, 3);
    const label = SKILLS[used]?.name ?? used;
    if (matches.length === 0) {
      return {
        intent: "resources",
        answer: `I don't have curated resources tagged for "${label}" yet — but here's the practical rule: prefer interactive practice + docs over passive videos, and timebox each session. Run the next assessment and I'll attach a matched resource list.`,
        suggestedNext: ["What should I learn this week?", "What is my biggest skill gap?"],
      };
    }
    return {
      intent: "resources",
      answer: `Best resources for ${label}, beginner-first:\n\n${matches.map((r) => `• ${r.title} — ${formatMinutes(r.durationMinutes)}\n  ${r.description}\n  ${r.url}`).join("\n")}\n\nStart with the top one — it's the shortest path to a checkpoint pass.`,
      suggestedNext: ["What should I learn this week?", "What is my biggest skill gap?"],
    };
  }

  if (/resource|study|material/.test(q)) {
    const plan = state.plan;
    const task = plan ? firstIncomplete(plan) : undefined;
    if (!task) return { intent: "resources", answer: "Build your journey first, then ask me for the next resources." };
    return {
      intent: "resources",
      answer: `Next up: ${task.title}\n\n${task.resources.map((r) => `• ${r.title} — ${formatMinutes(r.durationMinutes)}, ${r.type}\n  ${r.description}`).join("\n") || "• complete the practice items (no external links needed)"}`,
      suggestedNext: ["What should I learn this week?", "What is my biggest skill gap?"],
    };
  }

  if (/why.*(change|adapt|agentic|different)/.test(q)) {
    return {
      intent: "why-different",
      answer: `EduPath is adaptive, not static. It observes your profile, reasons about gaps against a target role, builds a plan, evaluates your assessment evidence, and then adapts — inserting reinforcement where you struggle.\n\nEvery major change carries a reason + evidence, and you stay in control: you accept or reject each proposed update.`,
      suggestedNext: ["Why did my roadmap change?", "What is my biggest skill gap?"],
    };
  }

  return {
    intent: "fallback",
    answer: `Here's where you are right now:\n\n${state.profile ? `Learner: ${state.profile.name} → ${ROLES[state.profile.targetRole]?.label ?? state.profile.targetRole}\n` : "No profile yet.\n"}${state.plan ? `Journey: ${pathOf(state.plan).slice(0, 4).join(" → ")}${pathOf(state.plan).length > 4 ? " → …" : ""} (${completionOf(state.plan)}% done)\n` : ""}${state.skillGaps.length ? `Highest-priority gaps: ${gapsList(state)}\n` : ""}\nAsk me things like “What should I learn this week?”, “Why did my roadmap change?”, or “Which skill should I focus on first?”`,
    suggestedNext: [
      "What should I learn this week?",
      "What is my biggest skill gap?",
      "Why do I need statistics?",
    ],
  };
}

export function detachDependencies(skillId: string): string {
  const deps = SKILL_DEPENDENCIES.filter((d) => d.to === skillId).map((d) => SKILLS[d.from]?.name ?? d.from);
  return deps.length > 0 ? deps.join(", ") : "none required";
}

export function skillProjects(skillId: string, state: JourneyState): string[] {
  return state.profile?.projects.filter((p) => p.skills.includes(skillId)).map((p) => p.title) ?? [];
}

export function missingEvidenceSkills(state: JourneyState): string[] {
  return state.skillGaps
    .filter((g) => g.gap > 0 && state.profile?.skills.find((s) => s.skillId === g.skillId)?.evidenceType === "inferred")
    .map((g) => g.skill.name);
}

export function dependencyPreview(skillId: string): string {
  const dv = SKILL_DEPENDENCIES.filter((d) => d.from === skillId).map((d) => SKILLS[d.to]?.name ?? d.to);
  return dv.length ? dv.join(", ") : "—";
}

export function findSkillId(nameOrId: string): string | undefined {
  const id = nameOrId.toLowerCase().replace(/[^a-z-]/g, "");
  if (SKILLS[id]) return id;
  const match = Object.values(SKILLS).find(
    (s) => s.name.toLowerCase() === nameOrId.toLowerCase()
  );
  return match?.id;
}