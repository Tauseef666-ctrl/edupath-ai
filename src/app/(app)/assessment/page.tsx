"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Badge, Button, Card, cx, ProgressBar } from "@/components/ui";
import { AdaptiveChange } from "@/components/adaptive-change";
import { useJourney } from "@/lib/store";
import { ASSESSMENTS } from "@/lib/data/assessments";
import { demoAnswersForStatistics } from "@/lib/data/demo";
import { SKILLS } from "@/lib/data/roles";
import type { Assessment, AssessmentQuestion, AssessmentResult } from "@/lib/types";

function QuestionCard({
  q,
  index,
  total,
  value,
  onChange,
}: {
  q: AssessmentQuestion;
  index: number;
  total: number;
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="card-surface rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <Badge tone="indigo">{q.concept}</Badge>
        <span className="text-[11px] text-foreground/40">
          Question {index + 1} of {total}
        </span>
      </div>
      <p className="mt-3 text-[15px] font-semibold leading-relaxed">{q.prompt}</p>
      <div className="mt-4 space-y-2">
        {(q.options ?? []).map((opt, i) => {
          const active = value === i;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[13.5px] transition-colors",
                active
                  ? "border-accent bg-accent-soft/50 ring-1 ring-accent/30"
                  : "border-border bg-card hover:bg-muted/60"
              )}
            >
              <span
                className={cx(
                  "flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-semibold",
                  active ? "bg-accent text-white" : "bg-muted text-foreground/60"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: AssessmentResult;
}) {
  const { state } = useJourney();
  const pending = state.plan?.pendingChange;
  const passed = result.status === "passed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-muted" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                className={passed ? "stroke-emerald-500" : "stroke-rose-500"}
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - result.score / 100) }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-3xl font-bold">{result.score}%</span>
          </div>
          <p className="mt-3 text-[15px] font-semibold">{assessment.title}</p>
          <div className="mt-2">
            <Badge tone={passed ? "emerald" : "rose"}>
              {passed ? "Passed — journey continues" : "Needs reinforcement"}
            </Badge>
          </div>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-foreground/55">
            {passed
              ? "The Evaluation Agent found no weak concepts below the 60% per-concept threshold. Your journey continues as planned."
              : `The Evaluation Agent flagged ${result.weakConcepts.length} concept${result.weakConcepts.length === 1 ? "" : "s"} below the 60% threshold. EduPath prepared an adaptive update.`}
          </p>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {result.concepts.map((c) => (
            <div key={c.concept} className="rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                <span className="font-medium">{c.concept}</span>
                <Badge tone={c.weak ? "rose" : "emerald"}>{c.weak ? "Weak" : "Solid"}</Badge>
              </div>
              <ProgressBar
                value={c.accuracy * 100}
                tone={c.weak ? "rose" : "emerald"}
                className="h-1.5"
              />
            </div>
          ))}
        </div>
      </Card>

      {pending ? (
        <Card className="p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <p className="text-[15px] font-bold">EduPath adapted your journey</p>
          </div>
          <AdaptiveChange
            change={pending}
            result={result}
            plan={state.plan}
          />
          <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-4">
            <Link href="/roadmap#decide">
              <Button variant="outline">Decide on the update</Button>
            </Link>
            <Link href="/ask">
              <Button icon={<Wand2 className="h-4 w-4" />}>Ask why</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/roadmap">
            <Button icon={<ArrowRight className="h-4 w-4" />}>View my journey</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function AssessmentShell() {
  const params = useSearchParams();
  const skillId = params.get("skillId") ?? "statistics";
  const assessment = ASSESSMENTS[skillId] ?? ASSESSMENTS.statistics;

  const { state, submitAssessment } = useJourney();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState(false);

  const latest = useMemo(
    () => state.assessmentResults.find((r) => r.assessmentId === assessment.id),
    [state.assessmentResults, assessment.id]
  );
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / assessment.questions.length) * 100);
  const canSubmit = answered === assessment.questions.length;

  function doSubmit(next: Record<string, number>) {
    const full = { ...next };
    submitAssessment(assessment, full);
    setSubmitted(true);
  }

  if (submitted && latest) {
    return <ResultView assessment={assessment} result={latest} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{assessment.title}</h1>
            <Badge tone="indigo">{SKILLS[assessment.skillId]?.name}</Badge>
          </div>
          <p className="mt-1 max-w-xl text-[14px] text-foreground/55">{assessment.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {state.demoMode ? (
            <Button
              variant="secondary"
              size="sm"
              icon={<Wand2 className="h-3.5 w-3.5" />}
              onClick={() => {
                const demo = demoAnswersForStatistics();
                setAnswers(demo);
                doSubmit(demo);
              }}
              className="rounded-full"
            >
              Demo: auto-fill & submit
            </Button>
          ) : null}
          {!review ? (
            <button
              onClick={() => setReview(true)}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              Review all questions
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ProgressBar value={progress} className="flex-1" />
        <span className="text-[12px] font-medium text-foreground/50">{answered}/{assessment.questions.length}</span>
      </div>

      {review ? (
        <div className="space-y-4">
          {assessment.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i}
              total={assessment.questions.length}
              value={answers[q.id]}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={Object.keys(answers).length}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <QuestionCard
              q={assessment.questions[
                Math.min(answered, assessment.questions.length - 1)
              ]}
              index={Math.min(answered, assessment.questions.length - 1)}
              total={assessment.questions.length}
              value={
                answers[
                  assessment.questions[
                    Math.min(answered, assessment.questions.length - 1)
                  ].id
                ]
              }
              onChange={(v) =>
                setAnswers((prev) => ({
                  ...prev,
                  [assessment.questions[Math.min(answered, assessment.questions.length - 1)].id]: v,
                }))
              }
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[12.5px] text-foreground/50">
          <FileText className="h-4 w-4" /> The Evaluation Agent grades each concept separately — not
          just the total.
        </p>
        <div className="flex gap-3">
          {!review ? (
            <Button
              variant="outline"
              onClick={() => setReview(true)}
              icon={<ClipboardCheck className="h-4 w-4" />}
            >
              Review all
            </Button>
          ) : null}
          <Button
            icon={<Check className="h-4 w-4" />}
            disabled={!canSubmit}
            onClick={() => doSubmit(answers)}
          >
            Submit assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <FileText className="h-6 w-6 animate-pulse text-foreground/30" />
        </div>
      }
    >
      <AssessmentShell />
    </Suspense>
  );
}