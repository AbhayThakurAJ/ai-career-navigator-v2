import { useState } from "react";
import type { Profile } from "../lib/storage";

type Props = {
  name: string;
  onComplete: (profile: Profile) => void;
};

const EDUCATION = ["High school", "Undergraduate", "Graduate", "Bootcamp", "Self-taught"];
const SKILL_BANK = [
  "Writing",
  "Public speaking",
  "Python",
  "JavaScript",
  "Design",
  "Data analysis",
  "Leadership",
  "Marketing",
  "Research",
  "Mathematics",
];

export default function OnboardingForm({ name, onComplete }: Props) {
  const [educationLevel, setEducationLevel] = useState(EDUCATION[1]);
  const [field, setField] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState("");

  function toggleSkill(skill: string) {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!field.trim()) return;
    onComplete({ name, educationLevel, field: field.trim(), skills, interests: interests.trim() });
  }

  return (
    <div className="min-h-full max-w-2xl mx-auto px-6 py-14 animate-fade-up">
      <div className="font-mono text-xs tracking-widest uppercase text-accent">Step 1 of 2 · Your profile</div>
      <h2 className="font-display text-4xl font-600 mt-3">Where are you now, {name}?</h2>
      <p className="text-muted-foreground mt-3 mb-10 leading-relaxed">
        The more honest the starting point, the more useful the map. Nothing here is permanent.
      </p>

      <form onSubmit={submit} className="space-y-9">
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Education level
          </legend>
          <div className="flex flex-wrap gap-2">
            {EDUCATION.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setEducationLevel(opt)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  educationLevel === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Field of study or focus
          </span>
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g. Computer Science, Visual Arts, Biology"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </label>

        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Skills you already have{" "}
            <span className="text-muted-foreground/60 normal-case tracking-normal">
              ({skills.length} selected)
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {SKILL_BANK.map((skill) => {
              const active = skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card hover:border-accent/50"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {skill}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            What genuinely interests you?
          </span>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            rows={3}
            placeholder="Problems you'd love to solve, subjects you lose track of time on…"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 outline-none transition resize-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </label>

        <button
          type="submit"
          disabled={!field.trim()}
          className="rounded-md bg-primary text-primary-foreground px-6 py-3 font-500 transition hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to your goal →
        </button>
      </form>
    </div>
  );
}
