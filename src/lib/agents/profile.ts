import type { AgentEvent, LearnerProfile } from "@/lib/types";
import { uid } from "@/lib/utils";
import { ROLE_SKILLS, SKILLS } from "@/lib/data/roles";

export interface EventSink {
  emit: (agent: AgentEvent["agent"], action: string, summary: string, metadata?: Record<string, unknown>) => AgentEvent;
}

export function createEventSink(): EventSink {
  return {
    emit: (a, action, summary, metadata) => ({
      id: uid("evt"),
      agent: a,
      action,
      status: "completed" as const,
      summary,
      timestamp: new Date().toISOString(),
      metadata,
    }),
  };
}

export interface ProfileAnalysis {
  profile: LearnerProfile;
  events: AgentEvent[];
  summary: string;
}

export function analyzeProfile(raw: LearnerProfile): ProfileAnalysis {
  const sink = createEventSink();
  const events: AgentEvent[] = [];
  sink.emit = (a, action, summary, metadata) => {
    const evt: AgentEvent = {
      id: uid("evt"),
      agent: a,
      action,
      status: "completed",
      summary,
      timestamp: new Date().toISOString(),
      metadata,
    };
    events.push(evt);
    return evt;
  };

  const roleSkills = ROLE_SKILLS[raw.targetRole] ?? [];
  const known = new Set(raw.skills.map((s) => s.skillId));

  const enriched: LearnerProfile = {
    ...raw,
    skills: raw.skills.map((s) => ({
      ...s,
      evidenceType:
        s.evidenceType ?? (s.confidence >= 0.7 ? "declared" : "inferred"),
    })),
  };

  for (const skillId of roleSkills) {
    if (!known.has(skillId)) {
      enriched.skills.push({
        skillId,
        currentLevel: 0,
        evidenceType: "inferred",
        confidence: 0.25,
        evidence: "No signal found in your profile or projects.",
      });
    }
  }

  const inferred = enriched.skills.filter((s) => s.evidenceType === "inferred").length;
  const supported = enriched.skills.filter((s) => s.evidenceType === "evidence-supported").length;

  events.push({
    id: uid("evt"),
    agent: "Profile Agent",
    action: "Parsed learner profile",
    status: "completed",
    summary: `Structured profile for ${raw.name}: ${enriched.skills.length} skills (${supported} evidence-supported, ${inferred} inferred), ${raw.projects.length} projects, ${raw.certifications.length} certifications.`,
    timestamp: new Date().toISOString(),
    metadata: { skills: enriched.skills.length, targetRole: raw.targetRole },
  });

  return {
    profile: enriched,
    events,
    summary: `${raw.name} → ${SKILLS[raw.targetRole]?.name ?? raw.targetRole}`,
  };
}