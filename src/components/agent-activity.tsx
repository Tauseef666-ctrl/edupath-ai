"use client";

import type { AgentEvent } from "@/lib/types";
import { Badge, cx } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Bot,
  Sparkles,
  GitFork,
  BookOpen,
  Map,
  ClipboardCheck,
  RefreshCw,
  CircuitBoard,
} from "lucide-react";

const AGENT_STYLE: Record<
  AgentEvent["agent"],
  { short: string; icon: typeof Bot; ring: string; dot: string }
> = {
  "Profile Agent": {
    short: "Profile",
    icon: CircuitBoard,
    ring: "bg-accent-soft text-accent",
    dot: "bg-accent",
  },
  "Skill Gap Agent": {
    short: "Gaps",
    icon: GitFork,
    ring: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
    dot: "bg-amber-400",
  },
  "Resource Agent": {
    short: "Resources",
    icon: BookOpen,
    ring: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
    dot: "bg-emerald-400",
  },
  "Planning Agent": {
    short: "Planning",
    icon: Map,
    ring: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
    dot: "bg-sky-400",
  },
  "Evaluation Agent": {
    short: "Evaluation",
    icon: ClipboardCheck,
    ring: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
    dot: "bg-rose-400",
  },
  "Adaptive Agent": {
    short: "Adaptive",
    icon: RefreshCw,
    ring: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
    dot: "bg-violet-400",
  },
  Orchestrator: {
    short: "Orchestrator",
    icon: Sparkles,
    ring: "bg-zinc-500/10 text-foreground/70",
    dot: "bg-zinc-400",
  },
};

export function AgentActivity({
  events,
  limit,
}: {
  events: AgentEvent[];
  limit?: number;
}) {
  const list = limit ? events.slice(0, limit) : events;
  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-foreground/50">
        Agent activity will appear here as EduPath works on your journey.
      </div>
    );
  }
  return (
    <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
      {list.map((evt, i) => {
        const style = AGENT_STYLE[evt.agent] ?? AGENT_STYLE["Orchestrator"];
        const Icon = style.icon;
        return (
          <motion.li
            key={evt.id}
            className="relative flex items-start gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.3 }}
          >
            <span
              className={cx(
                "z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full",
                style.ring
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold">{evt.agent}</span>
                <span className="text-[12px] text-foreground/40">{evt.action}</span>
                {typeof evt.metadata?.version === "number" ? (
                  <Badge tone="indigo" className="shrink-0">
                    v{evt.metadata.version}
                  </Badge>
                ) : null}
                <span className="ml-auto flex-none text-[11px] text-foreground/35">
                  {timeAgo(evt.timestamp)}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/60">
                {evt.summary}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function AgentChip({ agent }: { agent: AgentEvent["agent"] }) {
  const style = AGENT_STYLE[agent] ?? AGENT_STYLE["Orchestrator"];
  const Icon = style.icon;
  return (
    <span
      className={cx(
        "inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        style.ring
      )}
    >
      <Bot className="hidden h-3 w-3" />
      <Icon className="h-3.5 w-3.5" />
      {style.short}
    </span>
  );
}