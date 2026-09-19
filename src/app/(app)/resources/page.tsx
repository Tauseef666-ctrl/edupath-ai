"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Clock,
  ExternalLink,
  Library,
} from "lucide-react";
import { Badge, Card, EmptyState, cx } from "@/components/ui";
import { RESOURCES } from "@/lib/data/resources";
import { SKILLS } from "@/lib/data/roles";
import { formatMinutes } from "@/lib/utils";
import type { Resource, ResourceType } from "@/lib/types";

const TYPE_LABEL: Record<ResourceType, string> = {
  video: "Video",
  documentation: "Docs",
  article: "Article",
  course: "Course",
  practice: "Practice",
  project: "Project",
  book: "Book",
};

const ALL_SKILLS = Array.from(new Set(RESOURCES.map((r) => r.skillId))).sort(
  (a, b) => (SKILLS[a]?.name ?? a).localeCompare(SKILLS[b]?.name ?? b)
);

export default function ResourcesPage() {
  const [skill, setSkill] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [duration, setDuration] = useState<string>("all");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      if (skill !== "all" && r.skillId !== skill) return false;
      if (difficulty !== "all" && r.difficulty !== difficulty) return false;
      if (type !== "all" && r.type !== type) return false;
      if (duration === "short" && r.durationMinutes > 90) return false;
      if (duration === "medium" && (r.durationMinutes <= 90 || r.durationMinutes > 300)) return false;
      if (duration === "long" && r.durationMinutes <= 300) return false;
      return true;
    });
  }, [skill, difficulty, type, duration]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Resource library</h1>
        <p className="mt-1 text-[14px] text-foreground/55">
          Hand-curated learning material — every link verified, no invented URLs. The Resource Agent
          picks from this same library when building your journey.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/45">Skill</p>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[13px] outline-none focus:border-accent/60"
            >
              <option value="all">All skills</option>
              {ALL_SKILLS.map((s) => (
                <option key={s} value={s}>{SKILLS[s]?.name ?? s}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/45">Difficulty</p>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[13px] outline-none focus:border-accent/60"
            >
              <option value="all">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/45">Type</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[13px] outline-none focus:border-accent/60"
            >
              <option value="all">All types</option>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/45">Duration</p>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-2.5 text-[13px] outline-none focus:border-accent/60"
            >
              <option value="all">Any</option>
              <option value="short">Under 1.5h</option>
              <option value="medium">1.5–5h</option>
              <option value="long">5h+</option>
            </select>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-foreground/45">
          {filtered.length} resource{filtered.length === 1 ? "" : "s"} match your filters
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r: Resource) => (
          <Card
            key={r.id}
            className={cx(
              "group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/[0.05] dark:hover:shadow-black/30"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <BookOpen className="h-4.5 w-4.5" />
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                <Badge tone="indigo">{TYPE_LABEL[r.type]}</Badge>
                <Badge tone={r.difficulty === "beginner" ? "emerald" : r.difficulty === "intermediate" ? "amber" : "rose"}>
                  {r.difficulty}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-[14px] font-semibold leading-snug">{r.title}</p>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-foreground/55">{r.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-3 text-[11.5px] text-foreground/45">
                <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                  {SKILLS[r.skillId]?.name ?? r.skillId}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatMinutes(r.durationMinutes)}
                </span>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-2.5 py-1.5 text-[12px] font-semibold text-accent transition-colors group-hover:bg-accent group-hover:text-white"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No resources match those filters"
          description="Try widening the filters."
          icon={<Library className="h-8 w-8 text-foreground/30" />}
        />
      ) : null}
    </div>
  );
}