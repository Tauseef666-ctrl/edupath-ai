import type { AgentEvent, Resource, SkillGap } from "@/lib/types";
import { pickResources } from "@/lib/data/resources";
import { uid } from "@/lib/utils";

export interface ResourceSelection {
  bySkill: Record<string, Resource[]>;
  events: AgentEvent[];
}

export function selectResources(gaps: SkillGap[]): ResourceSelection {
  const events: AgentEvent[] = [];
  const bySkill: Record<string, Resource[]> = {};

  for (const gap of gaps.filter((g) => g.gap > 0)) {
    const difficulty =
      gap.requiredLevel <= 2 ? "beginner" : gap.requiredLevel <= 4 ? "intermediate" : "advanced";
    const selected = pickResources(gap.skillId, difficulty, 3);
    if (selected.length > 0) bySkill[gap.skillId] = selected;
  }

  const total = Object.values(bySkill).reduce((s, r) => s + r.length, 0);

  events.push({
    id: uid("evt"),
    agent: "Resource Agent",
    action: "Selected learning resources",
    status: "completed",
    summary: `Matched ${total} curated resources across ${Object.keys(bySkill).length} skill areas, aligned to each gap's required difficulty.`,
    timestamp: new Date().toISOString(),
    metadata: { resources: total, skills: Object.keys(bySkill).length },
  });

  return { bySkill, events };
}