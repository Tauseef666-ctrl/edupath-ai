# EduPath AI — Adaptive Personalized Learning & Skill-Gap Agent

EduPath observes what you know, reasons about the gap to a target role, builds a
personalized roadmap, **evaluates your evidence with assessments**, and then
**adapts** — inserting targeted reinforcement before you move on. Every change is
explained with reasons + evidence, and you stay in control (accept or reject each
roadmap update). Built for the Agentic AI Hackathon 2026.

## The agentic loop (all demoable offline)

1. **Observe** — Onboarding builds a rich profile (skills + *confidence/evidence*,
   projects, certifications, weekly hours).
2. **Reason** — The Skill-Gap Agent compares your profile to a target role and
   prioritizes gaps by dependency + importance.
3. **Act** — The Resource & Planning Agents produce a week-by-week learning plan,
   ordering skills by prerequisite dependencies and not re-teaching what you know.
4. **Evaluate** — A weighted per-concept assessment drives the Evaluation Agent.
5. **Adapt** — Below threshold? The Adaptive Agent inserts reinforcement modules +
   a re-check, re-packs weeks, and proposes a roadmap v2 with an explanation you
   accept or reject.
6. **Explain** — Ask EduPath *"Why did my roadmap change?"* and it answers from your
   live state (score, weak concepts, before/after paths).

> Demo learner **Alex** → *Machine Learning Engineer*: onboarding shows strong
> programming but weak foundations (Statistics 1/5, Probability 1/5). The Statistics
> Checkpoint demo answers land at exactly **48%** → triggers reinforcement in
> *Probability Foundations · Conditional Probability & Bayes · Probability Distributions*
> with a reassessment, all proposed before `NumPy`.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and click **Try the demo** (or Onboarding → *Fill as demo
learner Alex*). `?demo=1` on `/onboarding` auto-fills the demo learner and jumps to review.

Recommended path: landing → dashboard → gaps → roadmap → **assessment (auto-fill demo)** → accept road map update → **Ask EduPath** *"Why did my roadmap change?"*.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first theming, class-based dark mode)
- `motion` (Framer Motion) for the adaptive-diff animation, `lucide-react` icons
- State persisted to `localStorage` (`edupath:state:v2`)

## Architecture

```
src/lib/
  types.ts               core domain types (JourneyState, tasks, plans, changes…)
  agents/
    profile.ts           Observe — profile & evidence confidence
    skillgap.ts          Reason  — gap size, priority, why
    resource.ts          Act     — difficulty-matched resources per skill
    planning.ts          Act     — topological skill ordering, week packing, paths
    evaluation.ts        Evaluate— weighted per-concept scoring, weakness
    adaptive.ts          Adapt   — reinforcement insertion + re-plan + evidence
    resume.ts            optional profile hint from pasted resume text
  orchestrator.ts        runs the deterministic pipeline
  store.tsx / store-core.ts  React provider + pure state transitions
  ask.ts                 grounded assistant over live state (question → reply)
  data/                  roles, curated resources, assessments, demo keys
```

The whole agent engine is **pure TypeScript with no network calls** — deterministic
and judge-friendly. It is deliberately structured so a future `OPENAI_API_KEY`
provider can slot in behind the same `answerQuestion` / orchestrator interfaces.

## Scripts

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | dev server (Turbopack)           |
| `npm run build`     | production build + typecheck     |
| `npm run start`     | serve production build           |
| `npm run lint`      | ESLint                           |

## Deployment

Deploys as-is to Vercel (static, no server keys required). `export const runtime`
stays "edge/static" — nothing depends on a backend.