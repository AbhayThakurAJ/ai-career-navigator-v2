import { useState } from "react";

type Props = {
  onSelect: (goal: string) => void;
  onBack: () => void;
};

const SUGGESTED = [
  { goal: "Software Engineer", note: "Build products and systems that scale." },
  { goal: "Data Scientist", note: "Turn messy data into decisions." },
  { goal: "UX Designer", note: "Shape how people experience products." },
  { goal: "Product Manager", note: "Steer what gets built and why." },
  { goal: "Research Scientist", note: "Push the edge of what's known." },
  { goal: "Entrepreneur", note: "Turn an idea into a venture." },
];

export default function GoalSelection({ onSelect, onBack }: Props) {
  const [custom, setCustom] = useState("");

  return (
    <div className="min-h-full max-w-3xl mx-auto px-6 py-14 animate-fade-up">
      <button
        onClick={onBack}
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
      >
        ← Back to profile
      </button>
      <div className="font-mono text-xs tracking-widest uppercase text-accent mt-6">
        Step 2 of 2 · Your destination
      </div>
      <h2 className="font-display text-4xl font-600 mt-3">Where do you want to go?</h2>
      <p className="text-muted-foreground mt-3 mb-10 leading-relaxed">
        Pick a starting destination — you can always redraw the route later.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {SUGGESTED.map((s) => (
          <button
            key={s.goal}
            onClick={() => onSelect(s.goal)}
            className="group text-left rounded-lg border border-border bg-card p-5 transition hover:border-primary hover:shadow-[0_6px_24px_-12px_rgba(31,92,61,0.4)]"
          >
            <div className="font-display text-xl font-600 group-hover:text-primary transition">
              {s.goal}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.note}</div>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
          …or name your own
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (custom.trim()) onSelect(custom.trim());
          }}
          className="flex gap-2"
        >
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. Marine Biologist, Game Designer…"
            className="flex-1 rounded-md border border-border bg-card px-3 py-2.5 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            disabled={!custom.trim()}
            className="rounded-md bg-accent text-accent-foreground px-5 font-500 transition hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Chart it
          </button>
        </form>
      </div>
    </div>
  );
}
