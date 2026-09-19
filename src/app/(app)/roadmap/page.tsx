"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Clock,
  GitFork,
  Map,
  Sparkles,
  X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, cx } from "@/components/ui";
import { RoadmapTimeline } from "@/components/roadmap";
import { AdaptiveChange } from "@/components/adaptive-change";
import { useJourney } from "@/lib/store";
import { completionOf, planSummary } from "@/lib/agents/planning";
import { formatMinutes } from "@/lib/utils";

export default function RoadmapPage() {
  const { state, decide } = useJourney();
  const { plan, profile, assessmentResults } = state;
  const [localDecided, setLocalDecided] = useState(false);

  if (!plan || !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="No roadmap yet"
          description="Build your learning journey first using onboarding."
          icon={<Map className="h-8 w-8 text-foreground/30" />}
          action={
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>Build My Learning Path</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const pending = plan.pendingChange && !localDecided ? plan.pendingChange : undefined;
  const resultForChange = pending
    ? assessmentResults.find((r) => r.weakConcepts.length > 0)
    : undefined;
  const lastWeek = plan.tasks.length > 0 ? Math.max(...plan.tasks.map((t) => t.week)) : 0;
  const totalMinutes = plan.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  const progress = completionOf(plan);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Learning journey</h1>
            <Badge tone="indigo">v{plan.version}</Badge>
            {pending ? <Badge tone="amber">Update pending review</Badge> : null}
          </div>
          <p className="mt-1 text-[14px] text-foreground/55">{planSummary(plan)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[12px] text-foreground/45">Journey progress</p>
            <p className="text-lg font-bold">{progress}%</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-foreground/45">Projected span</p>
            <p className="text-lg font-bold">{lastWeek} weeks</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-foreground/45">Total effort</p>
            <p className="text-lg font-bold">{formatMinutes(totalMinutes)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-3 p-4">
          <Clock className="h-4 w-4 flex-none text-accent" />
          <p className="text-[12.5px] text-foreground/60">
            {profile.weeklyHours} hrs/week budget ·{" "}
            {plan.weeksPerSkill ? `${Object.keys(plan.weeksPerSkill).length} modules` : ""}
          </p>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <GitFork className="h-4 w-4 flex-none text-accent" />
          <p className="text-[12.5px] text-foreground/60">
            Skills you already meet (like{" "}
            {profile.skills.filter((s) => s.currentLevel >= 4).slice(0, 2).map((s) => s.skillId).join(", ") || "—"}
            ) are skipped — EduPath won&apos;t teach what you already know.
          </p>
        </Card>
      </div>

      {pending ? (
        <div id="change" className="scroll-mt-24">
          <Card className="p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[15px] font-bold">Journey updated — an adaptive decision</p>
                <p className="text-[12.5px] text-foreground/55">
                  Evaluation Agent evidence drove a replan. Nothing changes until you decide.
                </p>
              </div>
            </div>
            <AdaptiveChange change={pending} result={resultForChange} plan={plan} />
            <div id="decide" className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5 scroll-mt-24">
              <Button
                variant="outline"
                icon={<X className="h-4 w-4" />}
                onClick={() => {
                  decide("reject");
                  setLocalDecided(true);
                }}
              >
                Keep current plan
              </Button>
              <Button
                icon={<Check className="h-4 w-4" />}
                onClick={() => {
                  decide("approve");
                  setLocalDecided(true);
                }}
              >
                Accept change
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {plan.tasks.length > 0 ? (
        <div className={cx(pending && "opacity-40 pointer-events-none select-none")}>
          <RoadmapTimeline plan={plan} />
        </div>
      ) : (
        <EmptyState
          title="No modules yet"
          description="Complete onboarding for the Planning Agent to build your roadmap."
        />
      )}
    </div>
  );
}