# AI Career Navigator

A personalized career roadmap generator for students. Sign in, build a profile,
pick a career goal, and get an interactive, milestone-by-milestone roadmap with
progress tracking that persists locally.

Built with **React 19 + Vite + Tailwind CSS v4**, using **Google Gemini** to
generate roadmaps (with a local fallback so it works with no API key).

## Getting started

```bash
pnpm install
pnpm dev
```

### Enabling AI generation (optional)

Copy `.env.example` to `.env` and add a Gemini API key:

```bash
cp .env.example .env
# then set VITE_GEMINI_API_KEY=your_key
```

Without a key, the app uses a built-in deterministic roadmap generator, so the
full flow still works end to end.

## How it works

1. **Auth** — lightweight local sign-in / sign-up.
2. **Onboarding** — capture education level, field, existing skills, and interests.
3. **Goal** — choose a suggested destination or name your own.
4. **Roadmap** — Gemini (`gemini-2.0-flash`) returns 5–6 ordered milestones with
   skills and resources. Check them off; progress is saved to `localStorage`.

## Project structure

- `src/App.tsx` — flow orchestration and state
- `src/components/` — `AuthScreen`, `OnboardingForm`, `GoalSelection`, `RoadmapView`
- `src/lib/gemini.ts` — Gemini request + local fallback
- `src/lib/storage.ts` — types and `localStorage` persistence
- `src/index.css` — fonts, design tokens, base styles
