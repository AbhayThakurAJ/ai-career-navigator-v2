import { useEffect, useState } from "react";
import AuthScreen from "./components/AuthScreen";
import OnboardingForm from "./components/OnboardingForm";
import GoalSelection from "./components/GoalSelection";
import RoadmapView from "./components/RoadmapView";
import { generateRoadmap } from "./lib/gemini";
import { loadState, saveState, clearState, type AppState, type Profile } from "./lib/storage";

type Step = "auth" | "onboarding" | "goal" | "roadmap";

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Derive the current step from state — no duplicate/conditional double-render.
  let step: Step = "auth";
  if (state.user && !state.profile) step = "onboarding";
  else if (state.user && state.profile && !state.roadmap) step = "goal";
  else if (state.user && state.roadmap) step = "roadmap";

  function handleAuth(name: string) {
    setState((s) => ({ ...s, user: name }));
  }

  function handleProfile(profile: Profile) {
    setState((s) => ({ ...s, profile }));
  }

  async function handleGoal(goal: string) {
    if (!state.profile) return;
    setError(null);
    setGenerating(true);
    try {
      const roadmap = await generateRoadmap(state.profile, goal);
      setState((s) => ({ ...s, roadmap, completed: [] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating your roadmap.");
    } finally {
      setGenerating(false);
    }
  }

  function toggleMilestone(id: string) {
    setState((s) => ({
      ...s,
      completed: s.completed.includes(id)
        ? s.completed.filter((x) => x !== id)
        : [...s.completed, id],
    }));
  }

  function restart() {
    setState((s) => ({ ...s, roadmap: null, completed: [] }));
  }

  function signOut() {
    clearState();
    setState({ user: null, profile: null, roadmap: null, completed: [] });
  }

  if (generating) return <Generating />;

  return (
    <div className="min-h-full">
      {step !== "auth" && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-mono text-xs tracking-widest uppercase">Career Navigator</span>
          <div className="flex items-center gap-4">
            {state.user && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Signed in as <span className="text-foreground">{state.user}</span>
              </span>
            )}
            <button
              onClick={signOut}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-accent transition"
            >
              Sign out
            </button>
          </div>
        </header>
      )}

      {error && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-md border border-accent/50 bg-accent/10 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        </div>
      )}

      {step === "auth" && <AuthScreen onAuth={handleAuth} />}
      {step === "onboarding" && (
        <OnboardingForm name={state.user ?? "there"} onComplete={handleProfile} />
      )}
      {step === "goal" && (
        <GoalSelection
          onSelect={handleGoal}
          onBack={() => setState((s) => ({ ...s, profile: null }))}
        />
      )}
      {step === "roadmap" && state.roadmap && (
        <RoadmapView
          roadmap={state.roadmap}
          completed={state.completed}
          onToggle={toggleMilestone}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function Generating() {
  return (
    <div className="min-h-full grid place-items-center text-center px-6">
      <div className="animate-fade-up">
        <div className="mx-auto w-10 h-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        <h2 className="font-display text-2xl font-600 mt-6">Drawing your route…</h2>
        <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-wider">
          Plotting milestones
        </p>
      </div>
    </div>
  );
}
