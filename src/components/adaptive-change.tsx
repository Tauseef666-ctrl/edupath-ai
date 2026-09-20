"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, FileWarning, Sparkles, X } from "lucide-react";
import type { AssessmentResult, LearningPlan, PlanChange } from "@/lib/types";
import { cx } from "@/components/ui";

type PathItem = { label: string; inserted?: boolean };

function diffPath(previous: string[], updated: string[]): PathItem[] {
  const used = new Set<number>();
  return updated.map((label) => {
    const idx = previous.findIndex((p, i) => !used.has(i) && p === label);
    if (idx === -1) return { label, inserted: true };
    used.add(idx);
    return { label };
  });
}

function PathNode({ label, inserted }: { label: string; inserted?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.span
        className={cx(
          "relative flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-bold",
          inserted
            ? "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/40 dark:text-amber-300"
            : "bg-muted text-foreground/80 ring-1 ring-border"
        )}
        initial={inserted ? { scale: 0.5, opacity: 0 } : false}
        animate={inserted ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
      >
        {label.slice(0, 2).toUpperCase()}
        {inserted ? (
          <motion.span
            aria-hidden
            className="absolute -inset-1 rounded-xl border border-amber-500/50"
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        ) : null}
      </motion.span>
      <span
        className={cx(
          "text-center text-[11px] font-semibold leading-tight",
          inserted ? "text-amber-600 dark:text-amber-300" : "text-foreground/80"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Chain({ items }: { items: PathItem[] }) {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <PathNode label={item.label} inserted={item.inserted} />
          {i < items.length - 1 ? (
            <ArrowRight className="h-4 w-4 translate-y-[-10px] text-foreground/25" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function AdaptiveChange({
  change,
  result,
  plan,
}: {
  change: PlanChange;
  result?: AssessmentResult;
  plan?: LearningPlan | null;
}) {
  const isPending = change.status === "pending";

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={change.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="card-surface rounded-2xl bg-muted/50 p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                Previous journey · v{change.previousVersion}
              </p>
              <div className="opacity-55 grayscale">
                <Chain items={change.previousPath.map((l) => ({ label: l }))} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 px-1">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 220 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/12 ring-1 ring-rose-500/30"
              >
                <FileWarning className="h-5 w-5 text-rose-500" />
                <motion.span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-2xl border border-rose-500/40"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-foreground/45">Trigger</p>
                <p className="text-lg font-bold text-rose-500">
                  {result ? `${result.score}%` : "Score"}
                </p>
              </div>
              {result ? (
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {result.weakConcepts.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-600 dark:text-rose-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : null}
              <motion.span
                className="mt-2 text-[11px] font-semibold text-foreground/45"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                weak evidence detected
              </motion.span>
            </div>

            <div className="card-surface rounded-2xl p-5 ring-1 ring-indigo-500/25">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Updated journey · v{change.newVersion}
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/12 px-2 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-300">
                  <Sparkles className="h-3 w-3" /> amber = inserted
                </span>
              </div>
              <Chain items={diffPath(change.previousPath, change.updatedPath)} />
            </div>
          </div>

          <div className="card-surface rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h4 className="text-sm font-semibold">Journey updated — why?</h4>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/45">
                  Reason
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/80">
                  {change.reason}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/45">
                  Evidence that triggered this
                </p>
                <ul className="mt-1 space-y-1">
                  {change.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/70">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-500" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-muted px-4 py-3 text-[13px] text-foreground/70">
              <span className="font-semibold text-foreground">What changed:&nbsp;</span>
              {change.summary}
              {plan ? (
                <span className="mt-0.5 block text-foreground/60">
                  {(() => {
                    const proposed = change.proposedTasks ?? plan.tasks;
                    const weeks =
                      proposed.length > 0 ? Math.max(...proposed.map((t) => t.week)) : 0;
                    return `You now have ${proposed.length} tasks across ${weeks} week${weeks === 1 ? "" : "s"}.`;
                  })()}
                </span>
              ) : null}
            </div>
          </div>

          {isPending ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-5 py-4">
              <p className="text-[13.5px] text-amber-800 dark:text-amber-200">
                Your journey was updated based on this evidence. You decide what happens next.
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#decide"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 px-4 py-2.5 text-[13px] font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-500/25"
                >
                  <X className="h-4 w-4" /> Keep current plan
                </a>
                <a
                  href="#decide"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-on-accent shadow-sm shadow-indigo-600/25 hover:bg-accent-hover"
                >
                  <Check className="h-4 w-4" /> Accept change
                </a>
              </div>
            </div>
          ) : change.status === "approved" ? (
            <p className="rounded-2xl bg-emerald-500/10 px-5 py-3 text-[13.5px] text-emerald-700 dark:text-emerald-300">
              ✓ You approved this update — it is now your active roadmap (v{change.newVersion}).
            </p>
          ) : (
            <p className="rounded-2xl bg-muted px-5 py-3 text-[13.5px] text-foreground/70">
              You kept your current plan (v{change.previousVersion}). The proposed reinforcement was not applied.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}