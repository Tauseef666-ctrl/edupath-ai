import type { AgentEvent, LearnerProfile, SkillGap } from "@/lib/types";
import { ROLE_REQUIREMENTS, SKILLS, ROLES } from "@/lib/data/roles";
import { PRIORITY_RANK } from "@/lib/utils";
import { uid } from "@/lib/utils";

export interface SkillGapAnalysis {
  gaps: SkillGap[];
  events: AgentEvent[];
}

function boostPriority(
  base: "critical" | "high" | "medium" | "low",
  gap: number
): SkillGap["priority"] {
  if (gap >= 3) return "critical";
  if (base === "critical") return "critical";
  if (gap >= 2 && base === "medium") return "high";
  return base;
}

export function analyzeSkillGaps(profile: LearnerProfile): SkillGapAnalysis {
  const events: AgentEvent[] = [];
  const requirements = ROLE_REQUIREMENTS[profile.targetRole] ?? [];
  const currentBySkill = new Map(
    profile.skills.map((s) => [s.skillId, s.currentLevel])
  );

  const gaps: SkillGap[] = requirements.map((req) => {
    const current = currentBySkill.get(req.skillId) ?? 0;
    const gap = Math.max(0, req.requiredLevel - current);
    return {
      skillId: req.skillId,
      skill: SKILLS[req.skillId],
      currentLevel: current,
      requiredLevel: req.requiredLevel,
      gap,
      priority: boostPriority(req.priority, gap),
      reason:
        gap === 0
          ? `Already at or above the ${req.requiredLevel}/5 level required for the role.`
          : `${req.reason} You are at ${current}/5 but ${req.requiredLevel}/5 is expected.`,
    };
  });

  gaps.sort(
    (a, b) =>
      PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
      b.gap - a.gap
  );

  const critical = gaps.filter((g) => g.priority === "critical").length;

  events.push({
    id: uid("evt"),
    agent: "Skill Gap Agent",
    action: "Compared profile against target role",
    status: "completed",
    summary: `Identified ${gaps.filter((g) => g.gap > 0).length} skill gaps for ${ROLES[profile.targetRole]?.label ?? profile.targetRole}, including ${critical} critical.`,
    timestamp: new Date().toISOString(),
    metadata: { gaps: gaps.length, critical },
  });

  return { gaps, events };
}