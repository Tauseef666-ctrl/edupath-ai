"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Award,
  Briefcase,
  Clock,
  FileCheck,
  FolderGit2,
  Sparkles,
  Target,
  User2,
  Wand2,
} from "lucide-react";
import { Badge, Button, Card, CardHeader, EmptyState, LevelDots, ProgressBar } from "@/components/ui";
import { useJourney } from "@/lib/store";
import { ROLES, SKILLS } from "@/lib/data/roles";

const PREF_LABEL: Record<string, string> = {
  video: "Video courses",
  articles: "Articles",
  books: "Books",
  "hands-on": "Hands-on projects",
  structured: "Structured path",
  "self-paced": "Self-paced",
};

const EVIDENCE_TONE = {
  declared: "sky",
  "evidence-supported": "emerald",
  inferred: "amber",
} as const;

const EVIDENCE_LABEL = {
  declared: "Declared",
  "evidence-supported": "Evidence-supported",
  inferred: "Inferred",
} as const;

export default function ProfilePage() {
  const { state, setWeeklyHours } = useJourney();
  const { profile } = state;
  const [hoursDraft, setHoursDraft] = useState(profile?.weeklyHours ?? 8);

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="No learner profile yet"
          description="Run onboarding to build your learner profile."
          icon={<User2 className="h-8 w-8 text-foreground/30" />}
          action={
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>Start onboarding</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const role = ROLES[profile.targetRole];
  const sortedSkills = [...profile.skills].sort((a) =>
    a.evidenceType === "declared" ? 1 : a.evidenceType === "evidence-supported" ? -1 : 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Learner profile</h1>
        <p className="mt-1 text-[14px] text-foreground/55">
          What EduPath knows about you — and how confident it is, per skill.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <CardHeader
              title={profile.name}
              subtitle={`Build toward a career as a ${role?.label ?? profile.targetRole}.`}
              icon={<User2 className="h-4 w-4 text-accent" />}
              action={<Badge tone="indigo">{role?.label ?? profile.targetRole}</Badge>}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/45">
                  <Briefcase className="h-3 w-3" /> Experience
                </div>
                <p className="mt-1 text-[13px] font-semibold">{profile.experience}</p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/45">
                  <Clock className="h-3 w-3" /> Weekly availability
                </div>
                <p className="mt-1 text-[13px] font-semibold">{profile.weeklyHours} hrs/week</p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/45">
                  <Target className="h-3 w-3" /> Deadline
                </div>
                <p className="mt-1 text-[13px] font-semibold">
                  {profile.deadline ? new Date(profile.deadline).toLocaleDateString() : "None set"}
                </p>
              </div>
            </div>
            {profile.bio ? (
              <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed text-foreground/60">
                {profile.bio}
              </p>
            ) : null}
            {profile.learningPreferences.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.learningPreferences.map((p) => (
                  <Badge key={p}>{PREF_LABEL[p] ?? p}</Badge>
                ))}
              </div>
            ) : null}
          </Card>

          <Card className="p-5 sm:p-6">
            <CardHeader
              title="Weekly time budget"
              subtitle="EduPath rescales the roadmap around this. Total effort is unchanged — only the calendar stretches or compresses."
              icon={<Clock className="h-4 w-4 text-accent" />}
            />
            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min={2}
                max={40}
                value={hoursDraft}
                onChange={(e) => setHoursDraft(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <div className="flex items-center gap-2">
                <span className="w-16 text-right text-lg font-bold text-accent">{hoursDraft}h</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setWeeklyHours(hoursDraft);
                    setHoursDraft(hoursDraft);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-foreground/45">
              Plan currently spans {state.plan ? Math.max(...state.plan.tasks.map((t) => t.week)) : "—"} weeks at{" "}
              {profile.weeklyHours} hrs/week.
            </p>
          </Card>

          <Card className="p-5 sm:p-6">
            <CardHeader
              title="Skills"
              subtitle="Declared = you said so. Evidence-supported = EduPath found it in a project/resume. Inferred = a reasonable estimate EduPath makes from context — not a verified fact."
              icon={<FileCheck className="h-4 w-4 text-accent" />}
              action={
                <div className="flex flex-wrap justify-end gap-1.5">
                  <Badge tone="emerald">Evidence-supported</Badge>
                  <Badge tone="sky">Declared</Badge>
                  <Badge tone="amber">Inferred</Badge>
                </div>
              }
            />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {sortedSkills.map((s, i) => (
                <motion.div
                  key={s.skillId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="rounded-xl border border-border bg-muted/30 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold">{SKILLS[s.skillId]?.name ?? s.skillId}</span>
                    <Badge tone={EVIDENCE_TONE[s.evidenceType]}>{EVIDENCE_LABEL[s.evidenceType]}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <LevelDots level={s.currentLevel} />
                    <span className="text-[12px] font-medium text-foreground/50">
                      {s.currentLevel}/5
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={s.confidence * 100} tone="sky" className="h-1.5" />
                    <span className="text-[11px] text-foreground/45">
                      {Math.round(s.confidence * 100)}% conf.
                    </span>
                  </div>
                  {s.evidence ? (
                    <p className="mt-2 text-[11.5px] leading-snug text-foreground/50">{s.evidence}</p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <CardHeader
              title="Projects"
              subtitle="Evidence sources for your skills"
              icon={<FolderGit2 className="h-4 w-4 text-accent" />}
            />
            {profile.projects.length === 0 ? (
              <p className="mt-3 text-[13px] text-foreground/50">No projects recorded yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {profile.projects.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border bg-muted/30 p-3.5">
                    <p className="text-[13.5px] font-semibold">{p.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/55">{p.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.skills.map((s) => (
                        <Badge key={s} tone="indigo">{SKILLS[s]?.name ?? s}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <CardHeader
              title="Certifications & courses"
              icon={<Award className="h-4 w-4 text-accent" />}
            />
            {profile.certifications.length === 0 ? (
              <p className="mt-3 text-[13px] text-foreground/50">No certifications recorded yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {profile.certifications.map((c) => (
                  <div key={c.id} className="rounded-xl border border-border bg-muted/30 p-3.5">
                    <p className="text-[13.5px] font-semibold">{c.title}</p>
                    <p className="text-[12px] text-foreground/50">{c.issuer}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.skills.map((s) => (
                        <Badge key={s} tone="emerald">{SKILLS[s]?.name ?? s}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="rounded-xl bg-gradient-to-br from-accent-soft/60 to-transparent p-4">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-accent" />
                <p className="text-[13px] font-semibold">How does EduPath read skills?</p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/55">
                The Profile Agent distinguishes <em>declared</em> skills (you said so),{" "}
                <em>evidence-supported</em> skills (found in projects/resume), and{" "}
                <em>inferred</em> skills (estimated from context). It never presents an inference as a
                verified fact.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}