import type {
  AgentEvent,
  LearnerProfile,
  LearningPlan,
  Resource,
  SkillGap,
} from "@/lib/types";
import { analyzeProfile } from "@/lib/agents/profile";
import { analyzeSkillGaps } from "@/lib/agents/skillgap";
import { selectResources } from "@/lib/agents/resource";
import { buildPlan } from "@/lib/agents/planning";

export interface JourneyResult {
  profile: LearnerProfile;
  gaps: SkillGap[];
  resourcesBySkill: Record<string, Resource[]>;
  plan: LearningPlan;
  events: AgentEvent[];
}

export function runJourneyAnalysis(raw: LearnerProfile): JourneyResult {
  const profileOut = analyzeProfile(raw);
  const gapOut = analyzeSkillGaps(profileOut.profile);
  const resourceOut = selectResources(gapOut.gaps);
  const planningOut = buildPlan(profileOut.profile, gapOut.gaps, resourceOut.bySkill);

  const events: AgentEvent[] = [
    ...profileOut.events,
    ...gapOut.events,
    ...resourceOut.events,
    ...planningOut.events,
  ];

  return {
    profile: profileOut.profile,
    gaps: gapOut.gaps,
    resourcesBySkill: resourceOut.bySkill,
    plan: planningOut.plan,
    events,
  };
}