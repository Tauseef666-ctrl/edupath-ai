"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, GitPullRequestArrow, Sparkles } from "lucide-react";
import type { PlanChange } from "@/lib/types";
import { CONCEPT_REINFORCEMENT } from "@/lib/agents/adaptive";
import { Badge, Button } from "@/components/ui";

function parseWeakConcepts(evidence: string[]): string[] {
  const line = evidence.find((e) => e.startsWith("Weak concepts detected: "));
  if (!line) return [];
  return line
    .replace("Weak concepts detected: ", "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseScore(evidence: string[]): number | null {
  const line = evidence.find((e) => /score:\s*\d+%/.test(e));
  const match = line?.match(/score:\s*(\d+)%/);
  return match ? Number(match[1]) : null;
}

export function AdaptiveUpdateCard({
  change,
  compact = false,
}: {
  change: PlanChange;
  compact?: boolean;
}) {
  const weak = parseWeakConcepts(change.evidence);
  const inserted = weak
    .map((c) => CONCEPT_REINFORCEMENT[c]?.label)
    .filter((v): v is string => Boolean(v));
  const score = parseScore(change.evidence);
  const skillName = change.evidence[0]?.split(" score")[0] ?? "Module";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-accent-soft/40 to-violet-500/10"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <GitPullRequestArrow className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] font-semibold">EduPath prepared an adaptive update</p>
              <Badge tone="amber" className="shrink-0">
                v{change.previousVersion} → v{change.newVersion}
              </Badge>
            </div>
            <p className="mt-0.5 max-w-xl text-[12.5px] leading-relaxed text-foreground/65">
              {score !== null ? `${skillName} scored ${score}%. ` : ""}
              {weak.length > 0 ? `Weakness flagged in ${weak.join(", ")}. ` : ""}
              {inserted.length > 0
                ? `EduPath inserted ${inserted.join(", ")}${
                    change.updatedPath.includes("Reassessment")
                      ? " and a re-check"
                      : ""
                  } before the next module.`
                : change.summary}
            </p>
            {compact ? null : (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {inserted.map((label) => (
                  <Badge key={label} tone="indigo" icon={<Sparkles className="h-3 w-3" />}>
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <Link href="/roadmap#change" className="shrink-0">
          <Button icon={<ArrowRight className="h-4 w-4" />}>Review the change</Button>
        </Link>
      </div>
    </motion.div>
  );
}