"use client";

import Link from "next/link";
import {
  Award,
  Clock,
  Flame,
  GitFork,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge, Card, EmptyState, ProgressBar, Button } from "@/components/ui";
import { useJourney } from "@/lib/store";
import { completionOf } from "@/lib/agents/planning";
import { timeAgo, formatMinutes } from "@/lib/utils";
import { ASSESSMENTS } from "@/lib/data/assessments";

export default function ProgressPage() {
  const { state } = useJourney();
  const { plan, profile, skillGaps, assessmentResults } = state;

  if (!profile || !plan) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Nothing to track yet"
          description="Progress appears once your journey exists."
          icon={<TrendingUp className="h-8 w-8 text-foreground/30" />}
          action={
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>Build My Learning Path</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const progress = completionOf(plan);
  const completedTasks = plan.tasks.filter((t) => t.status === "completed").length;
  const completedMinutes = plan.tasks
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.estimatedMinutes, 0);
  const totalMinutes = plan.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  const gapped = skillGaps.filter((g) => g.gap > 0);
  const met = skillGaps.filter((g) => g.gap === 0);
  const derivedStreak = Math.min(assessmentResults.filter((r) => r.status === "passed").length, 7);

  const weeklyMinutes = profile.weeklyHours;
  const feltWeeks = Math.max(1, Math.round(totalMinutes / (weeklyMinutes * 60)));
  const lastPlannedWeek = plan.tasks.length > 0 ? Math.max(...plan.tasks.map((t) => t.week)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Progress</h1>
        <p className="mt-1 text-[14px] text-foreground/55">
          How far you&apos;ve come — and what the evidence says about readiness.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <TrendingUp className="h-3.5 w-3.5" /> Overall progress
          </div>
          <p className="mt-2 text-2xl font-bold">{progress}%</p>
          <ProgressBar value={progress} className="mt-2" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <Award className="h-3.5 w-3.5" /> Requirements met
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">{met.length}</p>
          <p className="mt-1 text-[12px] text-foreground/45">of {skillGaps.length} role skills</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <Clock className="h-3.5 w-3.5" /> Learning time logged
          </div>
          <p className="mt-2 text-2xl font-bold">{formatMinutes(completedMinutes)}</p>
          <p className="mt-1 text-[12px] text-foreground/45">
            {completedTasks}/{plan.tasks.length} tasks done · {formatMinutes(totalMinutes)} planned
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/50">
            <Flame className="h-3.5 w-3.5" /> Streak & assessments
          </div>
          <p className="mt-2 text-2xl font-bold">
            {assessmentResults.length}
            <span className="text-base font-medium text-foreground/50"> checks</span>
          </p>
          <p className="mt-1 text-[12px] text-foreground/45">
            {derivedStreak} passed on first attempt
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <p className="mb-4 text-[15px] font-semibold">Skill readiness</p>
          <div className="space-y-4">
            {skillGaps.map((g) => {
              const pct = g.requiredLevel > 0 ? (g.currentLevel / g.requiredLevel) * 100 : 0;
              return (
                <div key={g.skillId}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-medium">{g.skill.name}</span>
                    <span className={g.gap === 0 ? "text-emerald-500" : "text-foreground/55"}>
                      {g.currentLevel}/{g.requiredLevel}
                      {g.gap === 0 ? " ✓" : ""}
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(100, pct)}
                    tone={g.gap === 0 ? "emerald" : g.priority === "critical" ? "rose" : "accent"}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="mb-4 text-[15px] font-semibold">Assessment history</p>
          {assessmentResults.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-[13px] text-foreground/50">
              No assessment evidence yet. Take the Statistics Checkpoint to give the Evaluation Agent
              real signal.
            </div>
          ) : (
            <div className="space-y-2.5">
              {assessmentResults.map((r) => {
                const label = ASSESSMENTS[r.assessmentId]?.title ?? r.assessmentId;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold">{label}</p>
                      <p className="text-[12px] text-foreground/50">{timeAgo(r.createdAt)}</p>
                    </div>
                    {r.weakConcepts.length > 0 ? (
                      <Badge tone="rose">weak: {r.weakConcepts.join(", ")}</Badge>
                    ) : (
                      <Badge tone="emerald">passed</Badge>
                    )}
                    <span className="w-12 text-right text-lg font-bold">
                      {r.score}<span className="text-xs font-medium text-foreground/40">%</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between text-[12.5px] text-foreground/60">
              <span>Roadmap span</span>
              <span className="font-semibold">
                ~{lastPlannedWeek} week{lastPlannedWeek === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12.5px] text-foreground/60">
              <span>Scheduled at current pace</span>
              <span className="font-semibold">{feltWeeks} week{feltWeeks === 1 ? "" : "s"}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <GitFork className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-[14px] font-semibold">{gapped.length} gaps remain before {profile.targetRole}</p>
            <p className="text-[12.5px] text-foreground/55">
              {gapped[0] ? `Highest priority: ${gapped[0].skill.name}` : "All clear"}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Link href="/gaps">
            <Button variant="outline" icon={<GitFork className="h-4 w-4" />}>View gaps</Button>
          </Link>
          <Link href="/roadmap">
            <Button icon={<TrendingUp className="h-4 w-4" />}>Continue learning</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}