"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  BookOpen,
  GitFork,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, LevelDots } from "@/components/ui";
import { GapRow } from "@/components/gap-ui";
import { useJourney } from "@/lib/store";
import { ROLES, SKILLS, SKILL_DEPENDENCIES } from "@/lib/data/roles";
import { RESOURCES } from "@/lib/data/resources";
import { PRIORITY_LABEL } from "@/lib/utils";

export default function SkillGapsPage() {
  const { state, setTaskStatus } = useJourney();
  const { profile, skillGaps, plan } = state;
  const [selected, setSelected] = useState<string | null>(null);

  if (!profile || skillGaps.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="No skill-gap analysis yet"
          description="Run onboarding to have the Skill Gap Agent compare your skills against a target role."
          icon={<GitFork className="h-8 w-8 text-foreground/30" />}
          action={
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>Start onboarding</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const gapped = skillGaps.filter((g) => g.gap > 0);
  const met = skillGaps.filter((g) => g.gap === 0);
  const active = skillGaps.find((g) => g.skillId === selected) ?? gapped[0];
  const role = ROLES[profile.targetRole];

  const chain = (id: string) => {
    const deps: string[] = [];
    let current = id;
    for (let i = 0; i < 8; i++) {
      const dep = SKILL_DEPENDENCIES.find((d) => d.to === current);
      if (!dep) break;
      deps.unshift(SKILLS[dep.from]?.name ?? dep.from);
      current = dep.from;
    }
    deps.push(SKILLS[id]?.name ?? id);
    return deps;
  };

  const tasksFor = skillGaps
    .filter((g) => g.skillId === active.skillId)
    .flatMap((g) => (plan ? plan.tasks.filter((t) => t.skillId === g.skillId) : []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Skill gap analysis</h1>
        <p className="mt-1 text-[14px] text-foreground/55">
          The Skill Gap Agent compared your {profile.name} profile against the {role?.label} role
          requirements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[13px] font-bold">{gapped.length}</p>
          <p className="text-[12px] text-foreground/45">skills below required level</p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-bold text-rose-500">{gapped.filter((g) => g.priority === "critical").length}</p>
          <p className="text-[12px] text-foreground/45">critical gaps</p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-bold text-emerald-500">{met.length}</p>
          <p className="text-[12px] text-foreground/45">requirements already met</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {skillGaps.map((g, i) => (
            <GapRow key={g.skillId} gap={g} index={i} selected={active.skillId === g.skillId} onSelect={setSelected} />
          ))}
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold">{active.skill.name}</p>
              <Badge tone={active.gap === 0 ? "emerald" : active.priority === "critical" ? "rose" : "amber"}>
                {active.gap === 0 ? "Met" : PRIORITY_LABEL[active.priority]}
              </Badge>
            </div>

            <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/55">
              {active.skill.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-[11px] text-foreground/45">Current</p>
                <div className="mt-1.5"><LevelDots level={active.currentLevel} /></div>
                <p className="mt-1 text-[12px] font-semibold">{active.currentLevel}/5</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-[11px] text-foreground/45">Required</p>
                <div className="mt-1.5"><LevelDots level={active.requiredLevel} /></div>
                <p className="mt-1 text-[12px] font-semibold">{active.requiredLevel}/5</p>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-muted px-3.5 py-2.5 text-[12.5px] leading-relaxed text-foreground/65">
              <span className="font-semibold text-foreground">Why it matters: </span>
              {active.reason}
            </p>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                Dependency chain
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {chain(active.skillId).map((s, i, arr) => (
                  <span key={s + i} className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-muted px-2.5 py-1 text-[11.5px] font-medium text-foreground/75 ring-1 ring-border">
                      {s}
                    </span>
                    {i < arr.length - 1 ? <ArrowDown className="h-3 w-3 text-foreground/25" /> : null}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                Recommended resources
              </p>
              {RESOURCES.filter((r) => r.skillId === active.skillId).slice(0, 3).map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 hover:bg-muted"
                >
                  <BookOpen className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" />
                  <span>
                    <span className="block text-[12.5px] font-semibold">{r.title}</span>
                    <span className="text-[11.5px] text-foreground/50">{r.type} · {r.difficulty}</span>
                  </span>
                </a>
              ))}
            </div>

            {tasksFor.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                  Related tasks in your journey
                </p>
                <div className="space-y-1.5">
                  {tasksFor.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2">
                      <span className="text-[12px] font-medium">{t.title}</span>
                      <button
                        onClick={() =>
                          setTaskStatus(t.id, t.status === "completed" ? "pending" : "completed")
                        }
                        className={
                          "rounded-lg px-2 py-1 text-[11px] font-semibold " +
                          (t.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                            : "bg-accent-soft text-accent")
                        }
                      >
                        {t.status === "completed" ? "Done" : "Mark done"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}