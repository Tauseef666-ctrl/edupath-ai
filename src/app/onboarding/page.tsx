"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Suspense, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  Sparkles,
  Upload,
  Briefcase,
  Clock,
  SlidersHorizontal,
  Calendar,
  Target,
  Wrench,
} from "lucide-react";
import { Button, Card, Logo, ProgressBar, cx } from "@/components/ui";
import { ROLES, ROLE_SKILLS, SKILLS } from "@/lib/data/roles";
import { useJourney } from "@/lib/store";
import { parseResumeText } from "@/lib/agents/resume";
import type { LearnerProfile, ProfileSkill, Project } from "@/lib/types";
import { uid } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Target career", icon: Target },
  { id: 1, label: "Your skills", icon: Wrench },
  { id: 2, label: "Experience", icon: Briefcase },
  { id: 3, label: "Weekly hours", icon: Clock },
  { id: 4, label: "Preferences", icon: SlidersHorizontal },
  { id: 5, label: "Resume", icon: FileUp },
  { id: 6, label: "Deadline & review", icon: Calendar },
];

const COMMON_SKILLS = [
  "python",
  "sql",
  "javascript",
  "html_css",
  "git",
  "statistics",
  "probability",
  "numpy",
  "pandas",
  "machine-learning",
  "model-evaluation",
  "deep-learning",
  "data-processing",
  "react",
  "api",
];

const EXPERIENCES = ["Student", "Beginner", "Intermediate", "Experienced", "Senior"];

const PREFERENCES = ["video", "articles", "books", "hands-on", "structured", "self-paced"];

const PREF_LABEL: Record<string, string> = {
  video: "Video courses",
  articles: "Articles",
  books: "Books",
  "hands-on": "Hands-on projects",
  structured: "Structured path",
  "self-paced": "Self-paced",
};

const STAGE_LABELS = [
  "Analyzing your profile...",
  "Comparing target role requirements...",
  "Finding skill gaps...",
  "Building learning sequence...",
  "Selecting resources...",
  "Creating your journey...",
];

const DEMO_SKILL_LEVELS: Record<string, number> = {
  python: 4,
  sql: 4,
  javascript: 3,
  html_css: 4,
  git: 3,
  statistics: 1,
  probability: 1,
  "machine-learning": 1,
  "deep-learning": 0,
};

const DEMO_PROJECTS: Project[] = [
  { id: "prj-demo1", title: "Portfolio web application", description: "Responsive portfolio site with contact form.", skills: ["html_css", "javascript", "git"] },
  { id: "prj-demo2", title: "Data analysis mini-project", description: "Analysed a sales dataset with Python and SQL.", skills: ["python", "sql", "statistics"] },
];

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-foreground/40">
          Loading onboarding…
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const { runAnalysis } = useJourney();
  const params = useSearchParams();
  const demoAuto = params.get("demo") === "1";

  const [step, setStep] = useState(demoAuto ? 6 : 0);
  const [role, setRole] = useState(demoAuto ? "machine-learning-engineer" : "");
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(() => ({
    ...(demoAuto ? DEMO_SKILL_LEVELS : {}),
  }));
  const [experience, setExperience] = useState(
    demoAuto ? "Intermediate" : "Beginner"
  );
  const [bio, setBio] = useState(
    demoAuto ? "Self-taught developer exploring data analysis." : ""
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    demoAuto ? [...DEMO_PROJECTS] : []
  );
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [hours, setHours] = useState(8);
  const [prefs, setPrefs] = useState<string[]>(["video", "hands-on", "structured"]);
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [name, setName] = useState(demoAuto ? "Alex" : "");

  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const validations: Record<number, boolean> = {
    0: role !== "",
    1: Object.keys(skillLevels).length > 0,
    2: true,
    3: hours > 0,
    4: prefs.length > 0,
    5: true,
    6: true,
  };

  const canNext = validations[step];

  const roleSkills = useMemo(() => (role ? ROLE_SKILLS[role] ?? [] : []), [role]);

function toggleSkill(id: string) {
    setSkillLevels((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 3;
      return next;
    });
  }

  function applyDemo() {
    setRole("machine-learning-engineer");
    setSkillLevels({ ...DEMO_SKILL_LEVELS });
    setName("Alex");
    setHours(8);
    setExperience("Intermediate");
    setBio("Self-taught developer exploring data analysis.");
    setProjects([...DEMO_PROJECTS]);
  }

  function addProject() {
    if (!projectTitle.trim()) return;
    setProjects((p) => [
      ...p,
      { id: uid("prj"), title: projectTitle.trim(), description: projectDesc.trim() || "Personal project", skills: roleSkills.slice(0, 3) },
    ]);
    setProjectTitle("");
    setProjectDesc("");
  }

  async function handleResume(file: File) {
    const text = await file.text();
    setResumeName(file.name);
    setResumeText(text);
    const parsed = parseResumeText(text.slice(0, 8000));
    if (parsed.length > 0) {
      setSkillLevels((prev) => {
        const next = { ...prev };
        for (const s of parsed) {
          if (!(s.skillId in next)) next[s.skillId] = s.currentLevel;
        }
        return next;
      });
    }
  }

  function buildProfile(): LearnerProfile {
    const skills: ProfileSkill[] = Object.entries(skillLevels).map(([skillId, level]) => ({
      skillId,
      currentLevel: Math.min(5, level),
      evidenceType: "declared",
      confidence: 0.65,
      evidence: "Declared during onboarding.",
    }));

    if (resumeText.trim()) {
      const fromResume = parseResumeText(resumeText);
      for (const r of fromResume) {
        const idx = skills.findIndex((s) => s.skillId === r.skillId);
        if (idx >= 0) skills[idx] = { ...r, currentLevel: Math.max(skills[idx].currentLevel, r.currentLevel) };
        else skills.push(r);
      }
    }

    return {
      id: uid("profile"),
      name: name.trim() || "Learner",
      targetRole: role,
      experience,
      weeklyHours: hours,
      learningPreferences: prefs,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      bio,
      skills,
      projects,
      certifications: [],
      resumeText: resumeText.slice(0, 2000) || undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  function launch() {
    if (!canNext) return;
    setRunning(true);
    const profile = buildProfile();
    setTimeout(() => runAnalysis(profile), 50);

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i >= STAGE_LABELS.length) {
        clearInterval(timer);
        setTimeout(() => router.push("/dashboard"), 400);
      } else {
        setStage(i);
      }
    }, 520);
  }

  const activeRole = ROLES[role];

  return (
    <div className="relative min-h-screen">
      <header className="glass sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Logo />
          <div className="flex items-center gap-3 text-[13px] font-medium text-foreground/55">
            {running ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse text-accent" />
                Agents are working…
              </span>
            ) : (
              <>
                <span>New journey</span>
                <button onClick={() => router.push("/")} className="hover:text-foreground">
                  ← Back home
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {!running ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Tell EduPath where you&apos;re starting.
              </h1>
              <p className="mt-2 text-[14px] text-foreground/55">
                Seven quick steps. The agents handle the analysis.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                {STEPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={cx(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      s.id === step ? "bg-accent" : s.id < step ? "bg-indigo-400/60" : "bg-muted"
                    )}
                    aria-label={`Go to step ${s.label}`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div>
                    <p className="mb-4 text-[13px] font-semibold text-foreground/60">
                      What career are you targeting?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.values(ROLES).map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={cx(
                            "rounded-2xl border bg-card p-5 text-left transition-all",
                            role === r.id
                              ? "border-accent ring-1 ring-accent/40 bg-accent-soft/40"
                              : "border-border hover:border-border hover:bg-muted/60"
                          )}
                        >
                          <p className="font-semibold">{r.label}</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/55">
                            {r.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
                      <p className="text-[13px] text-foreground/70">
                        <span className="font-semibold">No time for the whole form?</span> Load the
                        demo learner <span className="font-semibold">Alex</span> — a beginner/intermediate
                        developer targeting Machine Learning Engineer with meaningful skill gaps.
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => {
                          applyDemo();
                          setStep(2);
                        }}
                        icon={<Sparkles className="h-3.5 w-3.5" />}
                      >
                        Fill as demo learner Alex
                      </Button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] text-foreground/60">
                        Select the skills you already have and set your level. Only add what you truly
                        know.
                      </p>
                      {roleSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {roleSkills.map((s) => (
                            <Button
                              key={s}
                              size="sm"
                              variant={skillLevels[s] ? "secondary" : "outline"}
                              onClick={() =>
                                setSkillLevels((prev) => {
                                  const next = { ...prev };
                                  if (next[s]) delete next[s];
                                  else next[s] = 2;
                                  return next;
                                })
                              }
                              className="rounded-full"
                            >
                              {SKILLS[s]?.name ?? s}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {COMMON_SKILLS.map((id) => {
                        const active = skillLevels[id] !== undefined;
                        return (
                          <div
                            key={id}
                            className={cx(
                              "rounded-2xl border p-4 transition-colors",
                              active ? "border-accent/60 bg-accent-soft/40" : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSkill(id)}
                                  className={cx(
                                    "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                                    active ? "border-accent bg-accent text-white" : "border-border bg-muted"
                                  )}
                                >
                                  {active ? <Check className="h-3 w-3" /> : null}
                                </button>
                                <span className="text-[13.5px] font-semibold">{SKILLS[id]?.name}</span>
                              </div>
                              {active && skillLevels[id] > 0 ? (
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((l) => (
                                    <button
                                      key={l}
                                      onClick={() => setSkillLevels((prev) => ({ ...prev, [id]: l }))}
                                      className={cx(
                                        "h-3 w-7 rounded-full transition-colors sm:w-5",
                                        l <= skillLevels[id]
                                          ? l <= 2
                                            ? "bg-amber-400"
                                            : "bg-indigo-400"
                                          : "bg-muted"
                                      )}
                                      aria-label={`Level ${l}`}
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-[13px] font-semibold text-foreground/60">Experience level</p>
                      <div className="flex flex-wrap gap-2">
                        {EXPERIENCES.map((e) => (
                          <Button
                            key={e}
                            size="sm"
                            variant={experience === e ? "secondary" : "outline"}
                            onClick={() => setExperience(e)}
                            className="rounded-full"
                          >
                            {e}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-[13px] font-semibold text-foreground/60">
                        A quick bio (what have you worked on?)
                      </p>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Self-taught developer, built a few web apps, recently started exploring data."
                        className="h-24 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-[13.5px] outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-[13px] font-semibold text-foreground/60">
                        Projects (evidence EduPath can use)
                      </p>
                      {projects.length > 0 ? (
                        <div className="mb-3 space-y-2">
                          {projects.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                              <Check className="h-4 w-4 text-emerald-500" />
                              <div>
                                <p className="text-[13px] font-semibold">{p.title}</p>
                                <p className="text-[12px] text-foreground/50">{p.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-3 sm:flex-row">
                        <input
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="Project title"
                          className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-[13px] outline-none focus:border-accent/60"
                        />
                        <Button size="md" variant="outline" onClick={addProject} icon={<PlusIcon />}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="mx-auto max-w-md">
                    <div className="card-surface rounded-2xl p-6">
                      <p className="text-[13px] font-semibold text-foreground/60">
                        How many hours per week can you commit?
                      </p>
                      <p className="mt-3 text-center text-5xl font-bold text-accent">
                        {hours}
                        <span className="text-lg font-medium text-foreground/50"> hrs/week</span>
                      </p>
                      <input
                        type="range"
                        min={2}
                        max={40}
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="mt-6 w-full accent-indigo-600"
                      />
                      <div className="mt-2 flex justify-between text-[11.5px] text-foreground/45">
                        <span>2 hrs</span>
                        <span>20 sprinters</span>
                        <span>40 hrs</span>
                      </div>
                      <p className="mt-4 text-[12.5px] leading-relaxed text-foreground/50">
                        EduPath schedules every module around this budget. Fewer hours stretches the
                        calendar; more hours compresses it.
                      </p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <p className="mb-4 text-[13px] font-semibold text-foreground/60">
                      How do you like to learn?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {PREFERENCES.map((p) => {
                        const on = prefs.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() =>
                              setPrefs((prev) =>
                                on ? prev.filter((x) => x !== p) : [...prev, p]
                              )
                            }
                            className={cx(
                              "flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 text-left transition-colors",
                              on ? "border-accent/60 bg-accent-soft/40" : "border-border"
                            )}
                          >
                            <span
                              className={cx(
                                "flex h-5 w-5 items-center justify-center rounded-md border",
                                on ? "border-accent bg-accent text-white" : "border-border bg-muted"
                              )}
                            >
                              {on ? <Check className="h-3 w-3" /> : null}
                            </span>
                            <span className="text-[13.5px] font-medium">{PREF_LABEL[p] ?? p}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[12.5px] text-foreground/50">
                      These preferences weight which learning resources EduPath recommends.
                    </p>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <p className="text-[13px] font-semibold text-foreground/60">
                      Resume or portfolio? Optional — but it gives EduPath hard evidence.
                    </p>
                    <p className="mt-1 text-[12.5px] text-foreground/50">
                      Parsing runs locally in your browser; nothing is uploaded. Extracted skills are
                      marked <span className="font-medium text-emerald-600 dark:text-emerald-300">evidence-supported</span> instead of
                      just &quot;declared&quot;.
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleResume(f);
                      }}
                    />
                    <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
                      <Upload className="h-8 w-8 text-foreground/35" />
                      {resumeName ? (
                        <>
                          <p className="text-[13.5px] font-semibold">{resumeName}</p>
                          <p className="max-w-sm text-[12.5px] text-foreground/55">
                            Parsed. Any matched skills were added to your profile as evidence-supported.
                          </p>
                          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                            Replace file
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setResumeText(""); setResumeName(""); }}>
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-[13.5px]">Drop a text, Markdown, or pasted resume</p>
                          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                            Choose file
                          </Button>
                          <textarea
                            value={resumeText}
                            onChange={(e) => {
                              setResumeText(e.target.value);
                              if (e.target.value.length > 40) {
                                const parsed = parseResumeText(e.target.value);
                                setSkillLevels((prev) => {
                                  const next = { ...prev };
                                  for (const s of parsed) if (!(s.skillId in next)) next[s.skillId] = s.currentLevel;
                                  return next;
                                });
                              }
                            }}
                            placeholder="…or paste resume text here"
                            className="h-28 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-[13px] outline-none focus:border-accent/60"
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="mb-1.5 text-[12px] font-semibold text-foreground/60">Your name</p>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter a name"
                          className="h-10 w-full rounded-xl border border-border bg-card px-3 text-[13px] outline-none focus:border-accent/60"
                        />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[12px] font-semibold text-foreground/60">Optional deadline</p>
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="h-10 w-full rounded-xl border border-border bg-card px-3 text-[13px] outline-none focus:border-accent/60"
                        />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[12px] font-semibold text-foreground/60">Hours/week</p>
                        <p className="h-10 rounded-xl border border-border bg-muted px-3 py-2.5 text-[13px] text-foreground/60">
                          {hours} hrs
                        </p>
                      </div>
                    </div>

                    <div className="card-surface rounded-2xl p-5">
                      <p className="mb-3 text-[13px] font-semibold">Review your starting state</p>
                      <div className="space-y-2 text-[13px]">
                        <p className="flex justify-between gap-4"><span className="text-foreground/50">Target role</span><span className="font-semibold">{activeRole?.label ?? "—"}</span></p>
                        <p className="flex justify-between gap-4"><span className="text-foreground/50">Skills declared</span><span className="font-semibold">{Object.keys(skillLevels).length}</span></p>
                        <p className="flex justify-between gap-4"><span className="text-foreground/50">Evidence-supported</span><span className="font-semibold">{resumeText ? parseResumeText(resumeText).length : 0}</span></p>
                        <p className="flex justify-between gap-4"><span className="text-foreground/50">Projects</span><span className="font-semibold">{projects.length}</span></p>
                        <p className="flex justify-between gap-4"><span className="text-foreground/50">Learning style</span><span className="font-semibold">{prefs.map((p) => PREF_LABEL[p] ?? p).join(", ")}</span></p>
                      </div>
                      {roleSkills.length > 0 ? (
                        <p className="mt-3 border-t border-border pt-3 text-[12.5px] leading-relaxed text-foreground/50">
                          EduPath will check what you already know against the{" "}
                          <span className="font-medium text-foreground/75">{activeRole?.label}</span>{" "}
                          requirements — it won&apos;t waste time teaching skills you already have.
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || running}
              >
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  icon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext || running}
                >
                  Continue
                </Button>
              ) : (
                <Button icon={<Sparkles className="h-4 w-4" />} onClick={launch} disabled={!canNext}>
                  Analyze My Skills
                </Button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-md py-16"
          >
            <Card className="p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <p className="font-semibold">{activeRole?.label}</p>
                  <p className="text-[12.5px] text-foreground/50">Journey being built by agents</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {STAGE_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={cx(
                      "flex items-center gap-3 text-[13px]",
                      i <= stage ? "text-foreground" : "text-foreground/35"
                    )}
                  >
                    <span className={cx("h-2 w-2 rounded-full", i < stage ? "bg-emerald-500" : i === stage ? "bg-accent dot-ring" : "bg-muted")} />
                    {label}
                  </div>
                ))}
              </div>
              <ProgressBar value={(stage / (STAGE_LABELS.length - 1)) * 100} className="mt-6" />
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function PlusIcon() {
  return <span className="text-lg leading-none">+</span>;
}