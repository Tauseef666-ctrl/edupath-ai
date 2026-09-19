"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { SkillGap } from "@/lib/types";
import { Badge, LevelDots, ProgressBar, cx } from "@/components/ui";
import { PRIORITY_LABEL } from "@/lib/utils";

const PRIORITY_TONE = {
  critical: "rose",
  high: "amber",
  medium: "sky",
  low: "zinc",
} as const;

export function GapRow({
  gap,
  onSelect,
  selected,
  index = 0,
}: {
  gap: SkillGap;
  onSelect?: (skillId: string) => void;
  selected?: boolean;
  index?: number;
}) {
  const hasGap = gap.gap > 0;
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(gap.skillId)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5) }}
      className={cx(
        "w-full rounded-2xl border bg-card p-4 text-left transition-colors",
        selected
          ? "border-accent/60 ring-1 ring-accent/40"
          : "border-border hover:border-border hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold">{gap.skill.name}</span>
            <Badge tone={PRIORITY_TONE[gap.priority]}>{PRIORITY_LABEL[gap.priority]}</Badge>
            {!hasGap ? <Badge tone="emerald">Met</Badge> : null}
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-foreground/45">Current</span>
                <LevelDots level={gap.currentLevel} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-foreground/45">Required</span>
                <LevelDots level={gap.requiredLevel} />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[20px] font-bold text-foreground">
                {gap.gap}
                <span className="text-[12px] font-medium text-foreground/40"> gap</span>
              </span>
              <span className="text-[11px] text-foreground/40">/5 pts</span>
            </div>
          </div>
          <ProgressBar
            value={(gap.currentLevel / 5) * 100}
            tone={gap.gap === 0 ? "emerald" : gap.priority === "critical" ? "rose" : "accent"}
            className="mt-3"
          />
        </div>
      </div>
    </motion.button>
  );
}

export function GapReason({ gap }: { gap: SkillGap }) {
  return (
    <div className="rounded-xl bg-muted px-4 py-3 text-[13px] leading-relaxed text-foreground/70">
      <span className="font-semibold text-foreground">Why it matters: </span>
      {gap.reason}
    </div>
  );
}

export function DependencyChain({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {skills.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span className="rounded-lg bg-muted px-2.5 py-1 text-[12px] font-medium text-foreground/80 ring-1 ring-border">
            {s}
          </span>
          {i < skills.length - 1 ? (
            <ArrowDown className="h-3.5 w-3.5 text-foreground/30" />
          ) : null}
        </div>
      ))}
    </div>
  );
}