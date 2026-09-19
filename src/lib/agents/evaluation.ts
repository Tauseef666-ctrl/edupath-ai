import type {
  AgentEvent,
  Assessment,
  AssessmentResult,
  ConceptResult,
} from "@/lib/types";
import { conceptWeights } from "@/lib/data/assessments";
import { uid } from "@/lib/utils";

export interface EvaluationOutput {
  result: AssessmentResult;
  events: AgentEvent[];
  decision: "continue" | "adapt";
}

export function evaluateAssessment(
  assessment: Assessment,
  answers: Record<string, number | string>,
  profileId: string
): EvaluationOutput {
  const events: AgentEvent[] = [];
  let correctWeight = 0;
  let totalWeight = 0;
  const correctById = new Map<string, boolean>();

  for (const q of assessment.questions) {
    const w = q.weight ?? 1;
    totalWeight += w;
    const answer = answers[q.id];
    let correct = false;
    if (q.answerIndex !== undefined) {
      correct = answer === q.answerIndex;
    } else if (q.numericAnswer !== undefined) {
      correct = Math.abs(Number(answer) - q.numericAnswer) < 0.01;
    }
    if (correct) correctWeight += w;
    correctById.set(q.id, correct);
  }

  const score = Math.round((correctWeight / totalWeight) * 100);

  const weights = conceptWeights(assessment);
  const conceptMap: Record<string, { correct: number; total: number }> = {};
  for (const q of assessment.questions) {
    const w = q.weight ?? 1;
    conceptMap[q.concept] = conceptMap[q.concept] ?? { correct: 0, total: 0 };
    conceptMap[q.concept].total += w;
    if (correctById.get(q.id)) conceptMap[q.concept].correct += w;
  }

  const conceptResults: ConceptResult[] = Object.entries(weights).map(([concept, total]) => {
    const c = conceptMap[concept] ?? { correct: 0, total };
    const accuracy = total > 0 ? c.correct / total : 0;
    return {
      concept,
      correct: c.correct,
      total,
      accuracy,
      weak: accuracy < 0.6,
    };
  });

  const weakConcepts = conceptResults.filter((c) => c.weak).map((c) => c.concept);
  const status: AssessmentResult["status"] =
    score >= 70 && weakConcepts.length === 0 ? "passed" : "needs-reinforcement";

  const result: AssessmentResult = {
    id: uid("res"),
    assessmentId: assessment.id,
    profileId,
    score,
    answers,
    concepts: conceptResults,
    weakConcepts,
    status,
    createdAt: new Date().toISOString(),
  };

  events.push({
    id: uid("evt"),
    agent: "Evaluation Agent",
    action: "Scored and analyzed assessment",
    status: "completed",
    summary: `${assessment.title} scored ${score}% (${status === "passed" ? "passed" : "needs reinforcement"}).`,
    timestamp: result.createdAt,
    metadata: { score, assessmentId: assessment.id },
  });

  const decision: "continue" | "adapt" = status === "passed" ? "continue" : "adapt";

  if (weakConcepts.length > 0) {
    events.push({
      id: uid("evt"),
      agent: "Evaluation Agent",
      action: "Detected weak concepts",
      status: "info",
      summary: `Weakness detected in ${weakConcepts.join(", ")} — evidence of unresolved fundamentals.`,
      timestamp: result.createdAt,
      metadata: { weakConcepts },
    });
  }

  events.push({
    id: uid("evt"),
    agent: "Evaluation Agent",
    action: decision === "adapt" ? "Triggered adaptive replanning" : "Journey continues",
    status: "completed",
    summary:
      decision === "adapt"
        ? `Learner below mastery threshold — recommending targeted reinforcement before the next module.`
        : "Learner at or above mastery — keeping the planned journey unchanged.",
    timestamp: result.createdAt,
    metadata: { decision },
  });

  return { result, events, decision };
}