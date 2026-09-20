# EduPath AI — Adaptive Learning Agent

**Your learning path should adapt to you.**

EduPath AI is an adaptive, agentic learning platform. It observes what you already
know, reasons about the gap to a target role, builds a personalized journey,
**evaluates your assessments for evidence**, and then **changes your roadmap when
the evidence says you need something different** — always explaining *why*, and
never acting without your control.

Built for the **Agentic AI Hackathon 2026**. This is a real, runnable application —
not a mockup.

---

## Problem

Generic course platforms and AI chatbots hand you a one-size-fits-all static plan:

- they never check what you actually know
- they treat a weak foundation the same as a strong one
- when you struggle, they just tell you to "try again" instead of changing direction
- the plan never explains *why* it looks the way it does

Result: learners burn weeks on material they don't need, or get stuck at a
prerequisite wall with no idea why.

## Solution

EduPath is **evidence-driven and adaptive**. It doesn't just generate a plan — it
runs a continuous, explainable loop:

> **Observe → Reason → Act → Evaluate → Adapt → Explain**

1. **Observe** — onboarding builds a learner profile: current skills with
   *confidence/evidence*, projects, certifications, weekly hours, target role.
2. **Reason** — a Skill-Gap Agent compares your profile to the target role's
   requirements, computes per-skill gaps, and prioritizes them by importance,
   prerequisites, and dependency ordering (e.g. *Statistics → Probability →
   Machine Learning*).
3. **Act** — Resource + Planning Agents turn gaps into a week-by-week roadmap
   with objectives, practice, difficulty, and matched resources.
4. **Evaluate** — you take a real assessment; an Evaluation Agent scores
   performance, breaks it down per concept, and flags weak concepts.
5. **Adapt** — if performance is below threshold, the Adaptive Agent proposes an
   updated roadmap (inserting reinforcement before it derails you), with the
   reason and evidence shown. It never forces the change — **you accept or reject**.
6. **Explain** — every change is explained from stored evaluation data, and you
   can ask *"Why did my roadmap change?"* to see the exact evidence and decision.

**The centerpiece demo:** Learner *Alex* targets *Machine Learning Engineer*, takes
the Statistics Checkpoint, scores **48%** — the Evaluation Agent detects weakness in
*Probability* and *Probability Distributions* — so the agent proposes inserting a
reinforcement stage before Machine Learning. The roadmap visibly changes and the
reason is fully explained. The whole thing runs from the UI.

## Why EduPath is agentic

EduPath is not a chatbot that happens to return study tips. It is a working
**multi-agent system** with distinct responsibilities coordinated by an
**Orchestrator**:

```
Observe      Profile Agent      builds the learner profile + evidence confidence
Reason       Skill-Gap Agent    computes gaps, priorities, dependency order
Act          Resource Agent     selects difficulty-matched resources
             Planning Agent     packs weeks, orders tasks topologically
Evaluate     Evaluation Agent   scores assessments, detects weak concepts
Adapt        Adaptive Agent     proposes replanning when evidence demands it
             Replanning Agent   re-resolves resources and re-packs the journey
Explain      Ask Agent          answers "why" from live learner state
```

Each agent has one clear responsibility; critical calculations stay deterministic
so the demo works offline and nothing is faked. The loop models the agentic
cycle **Observe → Reason → Act → Evaluate → Adapt → Explain**.

## Features

- 🎯 **Onboarding** — collects profile, target role, skills, projects,
  certifications, weekly hours, preferences (or auto-fill the demo learner *Alex*).
- 🧭 **Skill-gap analysis** — table of `Skill | Current | Required | Gap | Priority`
  with dependency ordering and per-skill "why it matters".
- 🗺️ **Personalized roadmap** — week-by-week journey ordered by prerequisites with
  objectives, practice, difficulty, and linked resources.
- 📝 **Adaptive assessment** — realistic checkpoint assessment (the Statistics demo
  scoring 48%) with per-concept analysis and weakness detection, plus an agent
  evaluation reveal between submit and results.
- 🔁 **Evaluation agent** — scores evidence, identifies weak concepts, and states
  whether reinforcement is required.
- 🧩 **Adaptive replanning** — the visual centerpiece: a *before/after* journey
  diff that highlights inserted reinforcement nodes, with reason + evidence and
  **Accept / Reject** learner control.
- 💡 **Adaptive update card** — the dashboard explains exactly what the agents
  found, which modules were inserted, and why, with a review CTA.
- 💬 **Ask EduPath** — grounded Q&A (`"Why did my roadmap change?"`, `"What should I
  learn this week?"`, `"What is my biggest skill gap?"`) answered from your real state.
- 📚 **Resource library** — curated resources (courses, docs, practice, projects,
  videos) with type, difficulty, duration, and description.
- 🤖 **Agent activity** — a live timeline of each agent's work: what it did, when,
  and what it decided.
- 🎨 **Brand identity suite** — generated mark/wordmark SVGs, app icon set, and a
  1200×630 OG image via `scripts/generate-assets.mjs` (uses the bundled `sharp`).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, static export) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) — modern, responsive, dark-mode aware
- [motion](https://motion.dev/) (`motion/react`) — smooth adaptive transitions
- [lucide-react](https://lucide.dev/) — clean icon set
- Deterministic agent engine in `src/lib/agents/*` — no network, no secrets, works offline

## Project structure

```
src/
  app/                  routing: /, /onboarding, /dashboard, /gaps, /roadmap,
                        /assessment, /progress, /resources, /ask, /profile
  components/           UI kit (ui.tsx, shell, roadmap, gap-ui, agent-activity…)
  lib/
    agents/             profile · skillgap · resource · planning · evaluation
                        adaptive · resume
    orchestrator.ts     coordinates the agent pipeline
    store.tsx           learner state (journey) + persistence (localStorage)
    ask.ts              grounded assistant over live learner state
    data/               roles, resources, assessments, demo seed
    types.ts            shared domain types
```

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Open <http://localhost:3000>. From the landing page click **Build My Learning Path**
(or **Explore Demo**) to start onboarding.

### Validation

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (static export)
```

### Regenerating brand assets

The icon set, mark/wordmark SVGs, and OG image live under `public/brand/` and
`src/app/icon.*`. To regenerate after changing the brand source:

```bash
node scripts/generate-assets.mjs
```

### Try the adaptive demo (60 seconds)

1. On the landing page, click **Explore Demo** → onboarding auto-fills **Alex**.
2. Review Alex's profile → the dashboard shows skill gaps vs. *Machine Learning Engineer*.
3. Open the **Roadmap** — the initial journey starts at *Statistics*.
4. Go to **Assessment** and take the *Statistics Checkpoint* (demo auto-completes).
   Alex scores **48%**.
5. Watch the **Evaluation Agent** flag *Probability* weaknesses, then review the
   **proposed updated roadmap**: it inserts reinforcement before Machine Learning.
6. **Accept** the change → the roadmap visibly adapts.
7. In **Ask EduPath**, ask *"Why did my roadmap change?"* — full evidence-based
   explanation.

## Environment variables

The demo is fully deterministic and runs with **no keys** — it works offline out of
the box.

To opt into an optional hosted LLM provider behind the same interface (not required
for the demo):

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | no | server-side key for the optional AI provider abstraction |
| `NEXT_PUBLIC_USE_LLM` | no | set `true` to route assisted answers through the provider |

Copy `.env.example` → `.env.local` and fill as needed. Secrets stay server-side;
`.env*` is gitignored and never committed.

## Development workflow (feature branches)

```bash
git checkout -b feature/improve-dashboard    # branch from main
# … implement …
npm run lint && npm run build                 # must pass before merging
git commit -m "feat: improve dashboard UX"
git push -u origin feature/improve-dashboard
# → Vercel preview deployment → test → merge to main
```

`main` = production. Merge via a normal commit; Vercel deploys production from `main`.

## Deployment

Deploys as a static export to [Vercel](https://vercel.com) — connect the GitHub repo,
set the build command `npm run build`, and deploy. No server keys required.

Production: <https://edupath-ai-alpha.vercel.app/>

---

## Future improvements

- Replace the deterministic answer/heuristic layer with an LLM behind the same
  `answer`/orchestrator interface, with streaming responses.
- Persist learner history server-side (DB) instead of `localStorage`.
- Community-contributed resources with verification, plus per-resource progress.
- Team/mentor sharing and collaborative roadmaps.
- Pluggable assessment question banks per role.
