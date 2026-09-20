"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  ClipboardCheck,
  Eye,
  MessageSquareText,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { Badge, cx } from "@/components/ui";

const LOOP = [
  { title: "Observe", icon: Eye, text: "Reads learner state — skills, projects, certifications, assessment evidence." },
  { title: "Reason", icon: BrainCircuit, text: "Compares current level against the target role's requirements." },
  { title: "Act", icon: Wrench, text: "Creates or modifies the learning journey with real agent tools." },
  { title: "Evaluate", icon: ClipboardCheck, text: "Analyses new evidence — scores and weak concepts, not just totals." },
  { title: "Adapt", icon: RefreshCw, text: "Changes future actions based on that evidence." },
  { title: "Explain", icon: MessageSquareText, text: "Every change carries a reason and the evidence behind it." },
];

const CYCLE_MS = 1350;
const LOOP_MS = CYCLE_MS * LOOP.length;

export function AgentLoopFlow() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % LOOP.length;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  const step = LOOP[active];

  return (
    <CardLoopShadow>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
          The agent loop
        </p>
        <Badge tone="indigo" icon={<RefreshCw className="h-3 w-3" />}>
          cycle {cycle + 1}
        </Badge>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-hidden>
        {LOOP.map((o, i) => {
          const Icon = o.icon;
          const isActive = i === active;
          return (
            <div key={o.title} className="flex items-center gap-2 sm:gap-3">
              <motion.div
                animate={isActive ? { scale: 1.07, y: -3 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cx(
                  "relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors",
                  isActive
                    ? "border-accent/60 bg-accent-soft shadow-glow"
                    : "border-border bg-card"
                )}
              >
                <Icon
                  className={cx("h-5 w-5", isActive ? "text-accent" : "text-foreground/45")}
                />
                {isActive ? (
                  <motion.span
                    className="absolute -inset-1 rounded-2xl border border-accent/40"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                ) : null}
                <span
                  className={cx(
                    "absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold",
                    isActive ? "bg-accent text-on-accent" : "bg-muted text-foreground/50"
                  )}
                >
                  {i + 1}
                </span>
              </motion.div>
              {i < LOOP.length - 1 ? (
                <motion.span
                  className="text-foreground/25"
                  animate={isActive ? { opacity: 1, x: [0, 2, 0] } : { opacity: 0.3 }}
                >
                  →
                </motion.span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex min-h-[64px] items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[14.5px] font-semibold">
              <span className="text-accent">{step.title}</span> —{" "}
              <span className="font-normal text-foreground/70">{step.text}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
        <motion.div
          key={cycle}
          className="h-full rounded-full bg-gradient-to-r from-accent to-violet-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: LOOP_MS / 1000, ease: "linear" }}
        />
      </div>
      <p className="mt-3 text-center text-[12px] font-medium text-foreground/45">
        The loop closes — Explain&apos;s findings become the next Observe.
      </p>
    </CardLoopShadow>
  );
}

function CardLoopShadow({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-surface relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}