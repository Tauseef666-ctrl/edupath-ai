export type EvidenceType = "declared" | "evidence-supported" | "inferred";

export type SkillCategory =
  | "programming"
  | "data"
  | "math"
  | "ai"
  | "engineering"
  | "web";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface ProfileSkill {
  skillId: string;
  currentLevel: number; // 0-5
  evidenceType: EvidenceType;
  confidence: number; // 0-1
  evidence?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  skills: string[];
}

export interface LearnerProfile {
  id: string;
  name: string;
  targetRole: string;
  experience: string;
  weeklyHours: number;
  learningPreferences: string[];
  deadline?: string;
  bio?: string;
  skills: ProfileSkill[];
  projects: Project[];
  certifications: Certification[];
  resumeText?: string;
  updatedAt: string;
}

export interface RoleRequirement {
  roleId: string;
  skill: Skill;
  requiredLevel: number; // 0-5
  priority: "critical" | "high" | "medium" | "low";
  reason: string;
}

export interface SkillGap {
  skillId: string;
  skill: Skill;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: "critical" | "high" | "medium" | "low";
  reason: string;
}

export type ResourceType =
  | "video"
  | "documentation"
  | "article"
  | "course"
  | "practice"
  | "project"
  | "book";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  skillId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  durationMinutes: number;
  description: string;
}

export type TaskStatus = "pending" | "in-progress" | "completed" | "blocked";

export interface LearningTask {
  id: string;
  skillId: string;
  week: number;
  title: string;
  objective: string;
  resources: Resource[];
  practice: string[];
  estimatedMinutes: number;
  status: TaskStatus;
  kind: "learn" | "practice" | "assessment" | "reassessment" | "relearn";
  assessmentId?: string;
}

export interface LearningPlan {
  id: string;
  profileId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  status: "active" | "needs-approval" | "approved";
  weeksPerSkill: Record<string, number>;
  tasks: LearningTask[];
  pendingChange?: PlanChange;
}

export type QuestionType = "mcq" | "problem" | "concept";

export interface AssessmentQuestion {
  id: string;
  concept: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answerIndex?: number;
  numericAnswer?: number;
  explanation: string;
  weight?: number;
}

export interface Assessment {
  id: string;
  skillId: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface ConceptResult {
  concept: string;
  correct: number;
  total: number;
  accuracy: number;
  weak: boolean;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  profileId: string;
  score: number; // 0-100
  answers: Record<string, number | string>;
  concepts: ConceptResult[];
  weakConcepts: string[];
  status: "passed" | "needs-reinforcement";
  createdAt: string;
}

export type AgentName =
  | "Profile Agent"
  | "Skill Gap Agent"
  | "Resource Agent"
  | "Planning Agent"
  | "Evaluation Agent"
  | "Adaptive Agent"
  | "Orchestrator";

export type AgentEventStatus = "started" | "completed" | "failed" | "info";

export interface AgentEvent {
  id: string;
  agent: AgentName;
  action: string;
  status: AgentEventStatus;
  summary: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type PlanDecision = "approve" | "reject";

export type PlanChangeStatus = "pending" | "approved" | "rejected";

export interface PlanChange {
  id: string;
  trigger: string;
  status: PlanChangeStatus;
  reason: string;
  evidence: string[];
  previousVersion: number;
  newVersion: number;
  summary: string;
  previousPath: string[];
  updatedPath: string[];
  createdAt: string;
  decidedAt?: string;
  previousTasks?: LearningTask[];
  proposedTasks?: LearningTask[];
}

export interface JourneyState {
  profile: LearnerProfile | null;
  plan: LearningPlan | null;
  skillGaps: SkillGap[];
  gapAnalysisDone: boolean;
  assessmentResults: AssessmentResult[];
  agentEvents: AgentEvent[];
  planChanges: PlanChange[];
  demoMode: boolean;
}

export interface AgentContext {
  profile: LearnerProfile;
  role: string;
}

export interface SkillDependency {
  from: string; // prerequisite
  to: string; // depends on `from`
}