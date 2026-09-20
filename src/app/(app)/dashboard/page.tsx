"use client";

import Link from "next/link";
import {
  ArrowRight,
  GitFork,
  Map,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import { Card, Badge, ProgressBar, EmptyState, Button, cx } from "@/components/ui";
import { useJourney } from "@/lib/store";
import { completionOf, firstIncomplete, planSummary } from "@/lib/agents/planning";
import { AgentActivity } from "@/components/agent-activity";
import { AdaptiveUpdateCard } from "@/components/adaptive-update-card";
import { ROLES } from "@/lib/data/roles";
import { formatMinutes, skillName } from "@/lib/utils";

export default function DashboardPage() {
  const { state } = useJourney();
  const { plan, profile, skillGaps, agentEvents, planChanges } = state;

  if (!profile || !plan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          title="Your journey hasn't been built yet"
          description="Tell EduPath where you are and where you want to go, or jump straight into the demo learner."
          icon={<Sparkles className="h-8 w-8 text-foreground/30" />}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/onboarding">
                <Button icon={<ArrowRight className="h-4 w-4" />}>Build My Learning Path</Button>
              </Link>
              <Link href="/onboarding?demo=1">
                <Button variant="outline">Load demo learner</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const progress = completionOf(plan);
  const next = firstIncomplete(plan);
  const gapped = skillGaps.filter((g) => g.gap > 0);
  const met = skillGaps.filter((g) => g.gap === 0);
  const critical = gapped.filter((g) => g.priority === "critical").length;
  const inProgress = new Set(
    plan.tasks.filter((t) => t.status === "in-progress" || t.status === "pending").map((t) => t.skillId)
  ).size;
  const role = ROLES[profile.targetRole];
  const pendingChange = plan.pendingChange;
  const lastChange = planChanges[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] text-foreground/50">
            {state.demoMode ? (
              <Badge tone="indigo">Demo learner</Badge>
            ) : (
              <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
            )}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {profile.name}
          </h1>
          <p className="mt-1 text-[14px] text-foreground/55">
            Roadmap v{plan.version} · {planSummary(plan)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/roadmap">
            <Button variant="outline" icon={<Map className="h-4 w-4" />}>Roadmap</Button>
          </Link>
          <Link href="/assessment?skillId=statistics">
            <Button icon={<ClipboardCheck className="h-4 w-4" />}>Take a Checkpoint</Button>
          </Link>
        </div>
      </div>

      {pendingChange ? (
        <AdaptiveUpdateCard change={pendingChange} />
      ) : lastChange && lastChange.status === "approved" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-5 py-4">
          <p className="text-[13.5px] text-emerald-700 dark:text-emerald-300">
            <span className="font-semibold">Your journey was adapted automatically:</span>{" "}
            {lastChange.summary}
          </p>
          <Link href="/roadmap#change" className="mt-1 text-[13px] font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300">
            View the update →
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <Target className="h-3.5 w-3.5" /> Target role
          </div>
          <p className="mt-2 text-[15px] font-bold leading-tight">{role?.label ?? profile.targetRole}</p>
          <p className="mt-1 text-[12px] text-foreground/45">{profile.deadline ? `Target: ${new Date(profile.deadline).toLocaleDateString()}` : "Open-ended journey"}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
              <TrendingUp className="h-3.5 w-3.5" /> Journey progress
            </div>
            <span className="text-[18px] font-bold">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone={progress >= 50 ? "emerald" : "accent"} className="mt-3" />
          <p className="mt-2 text-[12px] text-foreground/45">
            {plan.tasks.length} tasks ·{" "}
            {plan.tasks.length > 0 ? Math.max(...plan.tasks.map((t) => t.week)) : 0} weeks projected
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <CheckCircle2 className="h-3.5 w-3.5" /> Requirements met
          </div>
          <p className="mt-2 text-[26px] font-bold text-emerald-500">{met.length}</p>
          <p className="mt-1 flex gap-1.5 text-[12px] text-foreground/45">
            of {skillGaps.length} skills at required level
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <GitFork className="h-3.5 w-3.5" /> Open gaps
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-[26px] font-bold">{gapped.length}</p>
            {critical > 0 ? <Badge tone="rose">{critical} critical</Badge> : null}
          </div>
          <p className="mt-1 text-[12px] text-foreground/45">{inProgress} skills in progress</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold">Next up in your journey</h3>
                <p className="text-[12.5px] text-foreground/50">
                  {next ? `Week ${next.week} focus` : "All tasks complete"}
                </p>
              </div>
              <Link href="/roadmap" className="text-[13px] font-medium text-accent hover:underline">
                Full roadmap →
              </Link>
            </div>
            {next ? (
              <div className="space-y-2.5">
                {plan.tasks.filter((t) => t.week === next.week).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <span className={cx("h-2 w-2 rounded-full", t.status === "completed" ? "bg-emerald-500" : t.kind === "assessment" ? "bg-accent" : "bg-amber-400")} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold">{t.title}</p>
                      <p className="text-[12px] text-foreground/45">
                        {skillName(t.skillId)} · {formatMinutes(t.estimatedMinutes)}
                      </p>
                    </div>
                    {t.assessmentId ? (
                      <Link href={`/assessment?skillId=${t.skillId}`}>
                        <Button size="sm" variant="secondary">Start</Button>
                      </Link>
                    ) : (
                      <Link href="/roadmap">
                        <Button size="sm" variant="outline">Open</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-muted/40 px-4 py-6 text-center text-[13px] text-foreground/50">
                Every task complete — build a project or set a new target.
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold">Skill gap summary</h3>
                <p className="text-[12.5px] text-foreground/50">Where you are vs. the role&apos;s requirements</p>
              </div>
              <Link href="/gaps" className="text-[13px] font-medium text-accent hover:underline">
                Analyze →
              </Link>
            </div>
            <div className="space-y-4">
              {gapped.slice(0, 4).map((g) => {
                const pctLevel = (g.currentLevel / g.requiredLevel) * 100;
                return (
                  <div key={g.skillId}>
                    <div className="mb-1.5 flex items-center justify-between text-[13px]">
                      <span className="font-medium">{g.skill.name}</span>
                      <span className="text-foreground/50">
                        {g.currentLevel}/{g.requiredLevel}
                        <span className={cx("ml-2 font-semibold", g.priority === "critical" ? "text-rose-500" : "text-amber-500")}>
                          −{g.gap}
                        </span>
                      </span>
                    </div>
                    <ProgressBar
                      value={pctLevel}
                      tone={g.priority === "critical" ? "rose" : g.priority === "high" ? "amber" : "accent"}
                    />
                  </div>
                );
              })}
              {gapped.length === 0 ? (
                <p className="text-[13px] text-foreground/50">No skill gaps — every requirement is met. Nice.</p>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h3 className="mb-4 text-[15px] font-semibold">Recent agent activity</h3>
            <AgentActivity events={agentEvents} limit={7} />
          </Card>
        </div>
      </div>
    </div>
  );
}