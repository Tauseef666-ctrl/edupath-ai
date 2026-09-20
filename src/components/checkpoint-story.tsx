"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardCheck } from "lucide-react";
import { cx } from "@/components/ui";

const BEFORE = ["Statistics", "Machine Learning", "Model Evaluation", "Project"];

type PathNode = { label: string; inserted?: boolean };

const AFTER: PathNode[] = [
  { label: "Statistics" },
  { label: "Probability Reinforcement", inserted: true },
  { label: "Distributions", inserted: true },
  { label: "Statistics Re-assessment", inserted: true },
  { label: "Machine Learning" },
];

function List({ items }: { items: PathNode[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((n, i) => (
        <div key={n.label} className="flex items-center gap-2.5">
          <motion.span
            initial={n.inserted ? { opacity: 0, scale: 0.7, x: 8 } : false}
            animate={n.inserted ? { opacity: 1, scale: 1, x: 0 } : undefined}
            transition={{ type: "spring", stiffness: 280, damping: 18, delay: i * 0.18 }}
            className={cx(
              "relative rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold ring-1",
              n.inserted
                ? "bg-violet-500/12 text-violet-600 ring-violet-500/35 dark:text-violet-300"
                : "bg-muted text-foreground/75 ring-border"
            )}
          >
            {n.inserted ? (
              <motion.span
                aria-hidden
                className="absolute -inset-1 rounded-lg border border-violet-500/40"
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            ) : null}
            {n.label}
          </motion.span>
          {i < items.length - 1 ? <span className="text-foreground/25">↓</span> : null}
        </div>
      ))}
    </div>
  );
}

export function CheckpointStory() {
  const [adapted, setAdapted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAdapted((a) => !a), 4600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card-surface relative overflow-hidden rounded-3xl">
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="grid relative gap-0 lg:grid-cols-3">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
              {adapted ? "The journey adapts" : "The current journey"}
            </p>
            <span className="text-[11px] font-semibold text-foreground/40">
              v{adapted ? 2 : 1}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={adapted ? "adapted" : "before"}
              initial={{ opacity: 0, x: adapted ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: adapted ? -12 : 12 }}
              transition={{ duration: 0.3 }}
            >
              {adapted ? (
                <List items={AFTER} />
              ) : (
                <div className="space-y-2.5">
                  {BEFORE.map((s, i) => (
                    <div key={s} className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[12.5px] font-semibold text-foreground/75 ring-1 ring-border">
                        {s}
                      </span>
                      {i < BEFORE.length - 1 ? (
                        <span className="text-foreground/25">↓</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-rose-500/[0.05] p-6 lg:border-b-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/12 text-rose-500">
            <ClipboardCheck className="h-5 w-5" />
          </span>
          <p className="text-[13px] font-semibold text-foreground/80">Statistics Checkpoint</p>
          <div className="flex items-end gap-1">
            <motion.p
              key={adapted ? "low" : "ok"}
              initial={{ scale: adapted ? 1.08 : 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="text-4xl font-bold text-rose-500"
            >
              48%
            </motion.p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={adapted ? "weak" : "await"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <p className="text-[12px] text-foreground/60">weak concepts detected:</p>
              <p className="text-[12px] font-semibold text-rose-500">
                Probability · Distributions
              </p>
            </motion.div>
          </AnimatePresence>
          <motion.span
            className="mt-1 rounded-full bg-accent-soft px-2.5 py-1 text-[10.5px] font-semibold text-accent"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Evaluation Agent: below threshold
          </motion.span>
        </div>

        <div className="bg-accent-soft/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {adapted ? "After EduPath adapts" : "Preview — what EduPath would do"}
            </p>
          </div>
          {adapted ? <List items={AFTER} /> : <Preview />}
        </div>
      </div>
    </div>
  );
}

function Preview() {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-center">
      <motion.span
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <ClipboardCheck className="h-4 w-4" />
      </motion.span>
      <p className="text-[12.5px] font-medium text-foreground/55">
        On weak evidence, EduPath inserts reinforcement — explained.
      </p>
    </div>
  );
}