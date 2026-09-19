"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Moon,
  Sun,
  Sparkles,
  User,
  GitFork,
  Map,
  BookOpen,
  ClipboardCheck,
  RefreshCw,
  Eye,
  BrainCircuit,
  Wrench,
  MessageSquareText,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Button, Card, Logo, SectionLabel } from "@/components/ui";
import { useTheme } from "@/components/theme";
import { useJourney } from "@/lib/store";

const LOOP = [
  { label: "Profile", icon: User, blurb: "EduPath reads what you already know" },
  { label: "Skill Gap", icon: GitFork, blurb: "It compares you to your target role" },
  { label: "Plan", icon: Map, blurb: "It builds a personalized journey" },
  { label: "Learn", icon: BookOpen, blurb: "You work through the roadmap" },
  { label: "Assess", icon: ClipboardCheck, blurb: "Checkpoints measure your evidence" },
  { label: "Adapt", icon: RefreshCw, blurb: "Weaknesses change the path — explained" },
];

const OBSERVE = [
  {
    icon: Eye,
    title: "Observe",
    text: "Reads learner state — skills, projects, certifications, assessments.",
  },
  {
    icon: BrainCircuit,
    title: "Reason",
    text: "Compares current level against the target role's requirements.",
  },
  {
    icon: Wrench,
    title: "Act",
    text: "Creates or modifies the learning journey with real agent tools.",
  },
  {
    icon: ClipboardCheck,
    title: "Evaluate",
    text: "Analyses new evidence — assessment scores and weak concepts.",
  },
  {
    icon: RefreshCw,
    title: "Adapt",
    text: "Changes future actions based on that evidence.",
  },
  {
    icon: MessageSquareText,
    title: "Explain",
    text: "Every change carries a reason and the evidence behind it.",
  },
];

function LoopAnimation() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % LOOP.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {LOOP.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === active;
        return (
          <div key={step.label} className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={
                isActive
                  ? { scale: 1.05, y: -3 }
                  : { scale: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={
                "flex w-[104px] flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 " +
                (isActive
                  ? "border-accent/50 bg-accent-soft dot-ring"
                  : "border-border bg-card")
              }
            >
              <Icon
                className={
                  "h-4.5 w-4.5 " + (isActive ? "text-accent" : "text-foreground/40")
                }
              />
              <span
                className={
                  "text-[11px] font-semibold " +
                  (isActive ? "text-accent" : "text-foreground/60")
                }
              >
                {step.label}
              </span>
            </motion.div>
            {i < LOOP.length - 1 ? (
              <motion.span
                animate={isActive ? { x: [0, 4, 0], opacity: 1 } : { opacity: 0.3 }}
                transition={{ duration: 0.6 }}
                className="text-foreground/30"
              >
                →
              </motion.span>
            ) : null}
          </div>
        );
      })}
      <p className="mt-1 w-full text-center text-[12px] font-medium text-foreground/45">
        The adaptive loop runs on every learner — including you.
      </p>
    </div>
  );
}

function DemoLaunch() {
  const router = useRouter();
  const { loadDemo } = useJourney();
  return (
    <Button
      variant="outline"
      size="lg"
      icon={<Play className="h-4 w-4" />}
      onClick={() => {
        loadDemo();
        router.push("/dashboard");
      }}
    >
      Explore as demo learner “Alex”
    </Button>
  );
}

export default function Home() {
  const { dark, toggle } = useTheme();

  return (
    <div className="relative">
      <header className="glass sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-6 text-[13.5px] font-medium text-foreground/60 md:flex">
            <a href="#problem" className="hover:text-foreground">Problem</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#agents" className="hover:text-foreground">Agentic core</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground/70 hover:bg-muted"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/onboarding">
              <Button size="md" className="hidden sm:inline-flex">Open EduPath</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-foreground/60"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Agentic AI Hackathon 2026 · Adaptive learning orchestration
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
            >
              Your learning path
              <br />
              should <span className="text-gradient">adapt to you.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-foreground/60 sm:text-lg"
            >
              EduPath AI analyzes what you already know, identifies the skills you need for your
              target career, builds a personalized learning journey, and continuously adapts it as
              you learn.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link href="/onboarding">
                <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Build My Learning Path
                </Button>
              </Link>
              <DemoLaunch />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 sm:mt-20"
          >
            <LoopAnimation />
          </motion.div>
        </section>

        <section id="problem" className="border-t border-border bg-muted/40 py-20">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-12 max-w-2xl">
              <SectionLabel>The problem</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Static paths ignore that every learner starts somewhere different.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
                Learners know the career they want — but not what they already know, what they&apos;re
                missing, in what order to learn, or what to do when they struggle. Traditional
                platforms give everyone the same fixed course list.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["A generic roadmap", "“Learn these 12 courses” — identical for everyone, no matter what you already know."],
                ["No reaction to struggle", "When you fail a concept, the next module still arrives whether you&apos;re ready or not."],
                ["No explainable decisions", "If the platform changes your plan, you never learn why."],
              ].map(([t, d]) => (
                <Card key={t} className="p-6">
                  <p className="font-semibold">{t}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/55">{d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-20">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-10 max-w-2xl">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                The moment that changes the plan.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
                A learner takes a checkpoint. The Evaluation Agent spots a weakness. EduPath proposes
                a new journey — and shows exactly why, with the evidence.
              </p>
            </div>
            <Card className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-3">
                <div className="space-y-2.5 border-b border-border p-6 lg:border-b-0 lg:border-r">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                    Before the assessment
                  </p>
                  {["Statistics", "Machine Learning", "Model Evaluation", "Project"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[12.5px] font-semibold text-foreground/75 ring-1 ring-border">
                        {s}
                      </span>
                      {i < 3 ? <span className="text-foreground/25">↓</span> : null}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-rose-500/[0.05] p-6 lg:border-b-0">
                  <ClipboardCheck className="h-5 w-5 text-rose-500" />
                  <p className="text-[13px] font-semibold text-foreground/80">Statistics Checkpoint</p>
                  <p className="text-4xl font-bold text-rose-500">48%</p>
                  <p className="text-[12px] text-foreground/55">weak concepts: Probability</p>
                  <p className="text-[12px] text-foreground/55">& Probability distributions</p>
                </div>
                <div className="space-y-2.5 bg-accent-soft/40 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    EduPath adapts the path
                  </p>
                  {["Statistics", "Probability Reinforcement", "Distributions", "Statistics Re-assessment", "Machine Learning"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2.5">
                      <span className={"rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold ring-1 " + (i >= 1 && i <= 3 ? "bg-violet-500/12 text-violet-600 dark:text-violet-300 ring-violet-500/30" : "bg-muted text-foreground/75 ring-border")}>
                        {s}
                      </span>
                      {i < 4 ? <span className="text-foreground/25">↓</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="agents" className="border-t border-border bg-muted/40 py-20">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-10 max-w-2xl">
              <SectionLabel>Why agentic?</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Observe, reason, act, evaluate, adapt, explain.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
                EduPath isn&apos;t a chatbot with a study-plan template. It&apos;s an orchestration system with
                specialized agents — each with tools, evidence, and a visible activity log.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OBSERVE.map((o) => (
                <Card key={o.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-semibold">{o.title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/55">{o.text}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/onboarding">
                <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  Build My Learning Path
                </Button>
              </Link>
              <DemoLaunch />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Logo size="sm" />
          <p className="text-center text-[12.5px] text-foreground/45">
            EduPath doesn&apos;t just tell you what to learn. It understands where you are, where you want
            to go, watches how you learn, and adapts the path between the two.
          </p>
          <span className="flex items-center gap-1.5 text-[12px] text-foreground/40">
            <ShieldCheck className="h-3.5 w-3.5" /> Built for Agentic AI Hackathon 2026
          </span>
        </div>
      </footer>
    </div>
  );
}