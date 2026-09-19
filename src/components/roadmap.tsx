"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Check,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  BookOpen,
  PenTool,
  RotateCw,
} from "lucide-react";
import type { LearningPlan, LearningTask } from "@/lib/types";
import { useJourney } from "@/lib/store";
import { Badge, Button, cx } from "@/components/ui";
import { formatMinutes, skillName } from "@/lib/utils";

function TaskKindIcon({ task, className }: { task: LearningTask; className?: string }) {
  if (task.kind === "assessment" || task.kind === "reassessment") return <FileText className={className} />;
  if (task.kind === "practice") return <PenTool className={className} />;
  if (task.kind === "relearn") return <RotateCw className={className} />;
  return <BookOpen className={className} />;
}

function TaskRow({ task }: { task: LearningTask }) {
  const { setTaskStatus } = useJourney();
  const completed = task.status === "completed";
  const inProgress = task.status === "in-progress";
  const isAssessment = task.kind === "assessment" || task.kind === "reassessment";

  const iconRing = isAssessment
    ? "bg-accent-soft text-accent"
    : task.kind === "relearn"
      ? "bg-violet-500/12 text-violet-600 dark:text-violet-300"
      : "bg-muted text-foreground/70";

  return (
    <div
      className={cx(
        "group rounded-xl border p-3 transition-colors",
        completed
          ? "border-emerald-500/20 bg-emerald-500/[0.04]"
          : task.kind === "relearn"
            ? "border-violet-500/25 bg-violet-500/[0.04]"
            : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() =>
            setTaskStatus(
              task.id,
              completed ? "pending" : inProgress ? "completed" : "in-progress"
            )
          }
          className={cx(
            "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-colors",
            completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-border bg-muted hover:border-accent"
          )}
          aria-label="Toggle task status"
        >
          {completed ? <Check className="h-3 w-3" /> : null}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "flex h-7 w-7 flex-none items-center justify-center rounded-lg",
                iconRing
              )}
            >
              <TaskKindIcon task={task} className="h-3.5 w-3.5" />
            </span>
            <span
              className={cx(
                "text-[13.5px] font-semibold",
                completed && "text-foreground/45 line-through"
              )}
            >
              {task.title}
            </span>
            {task.kind === "relearn" ? <Badge tone="violet">Reinforcement</Badge> : null}
            {task.kind === "reassessment" ? <Badge tone="rose">Re-check</Badge> : null}
            {task.kind === "assessment" ? <Badge tone="indigo">Checkpoint</Badge> : null}
            {inProgress ? <Badge tone="amber">In progress</Badge> : null}
            <span className="ml-auto flex items-center gap-1 text-[11px] text-foreground/40">
              <Clock className="h-3 w-3" /> {formatMinutes(task.estimatedMinutes)}
            </span>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/55">
            {task.objective}
          </p>
          {task.resources.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.resources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/70 hover:bg-border hover:text-foreground"
                >
                  <BookOpen className="h-3 w-3" />
                  {r.title}
                </a>
              ))}
            </div>
          ) : null}
          {task.practice.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {task.practice.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-foreground/50">
                  <ChevronRight className="mt-0.5 h-3 w-3 flex-none text-foreground/25" />
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
          {isAssessment ? (
            <div className="mt-2.5">
              <Link href={`/assessment?skillId=${task.skillId}`}>
                <Button size="sm" variant="secondary" icon={<FileText className="h-3.5 w-3.5" />}>
                  {task.assessmentId ? "Take assessment" : "Open assessment"}
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function RoadmapTimeline({ plan }: { plan: LearningPlan }) {
  const weeks = Object.entries(
    plan.tasks.reduce<Record<number, LearningTask[]>>((acc, t) => {
      acc[t.week] = acc[t.week] ?? [];
      acc[t.week].push(t);
      return acc;
    }, {})
  ).sort((a, b) => Number(a[0]) - Number(b[0]));

  const skillSet = (tasks: LearningTask[]) =>
    Array.from(new Set(tasks.filter((t) => t.kind === "learn" || t.kind === "relearn").map((t) => t.skillId)));

  return (
    <div className="space-y-4">
      {weeks.map(([week, tasks], wi) => {
        const skills = skillSet(tasks);
        const done = tasks.filter((t) => t.status === "completed").length;
        return (
          <motion.div
            key={week}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(wi * 0.06, 0.4) }}
            className="card-surface relative rounded-2xl p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-soft text-[13px] font-bold text-accent">
                W{week}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">Week {week}</p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {skills.map((s) => (
                    <Badge key={s}>{skillName(s)}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-none items-center gap-2 text-[12px] text-foreground/45">
                {done}/{tasks.length} done
                {tasks.every((t) => t.status === "completed") ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Circle className="h-3 w-3 text-foreground/25" />
                )}
              </div>
            </div>
            <div className="space-y-2.5">{tasks.map((t) => <TaskRow key={t.id} task={t} />)}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function planTaskCount(plan: LearningPlan): number {
  return plan.tasks.length;
}