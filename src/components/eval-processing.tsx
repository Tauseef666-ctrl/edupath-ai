"use client";

import { motion } from "motion/react";
import { BrainCircuit, Check, ClipboardCheck, FolderGit2, Loader2 } from "lucide-react";
import { cx } from "@/components/ui";

const STEPS = [
  {
    label: "Scoring each concept separately",
    detail: "Evaluating answers concept-by-concept against the module threshold.",
    icon: ClipboardCheck,
  },
  {
    label: "Comparing evidence to the journey",
    detail: "Checking whether the next module can be reached from this foundation.",
    icon: FolderGit2,
  },
  {
    label: "Preparing an adaptive update",
    detail: "The Planner and Adaptive agents are staging the recommendation.",
    icon: BrainCircuit,
  },
];

export function EvalProcessing({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="card-surface mx-auto max-w-xl rounded-2xl p-6 sm:p-8"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Evaluation Agent · grading {title}</p>
          <p className="text-[12.5px] text-foreground/55">
            Translating raw answers into learning evidence…
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.5 }}
            >
              <span
                className={cx(
                  "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg",
                  "bg-muted text-foreground/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{step.label}</p>
                  <p className="text-[12px] text-foreground/50">{step.detail}</p>
                </div>
                <motion.span
                  className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.15 + i * 0.5, type: "spring", stiffness: 300 }}
                >
                  <Check className="h-3 w-3" />
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-violet-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.9, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}