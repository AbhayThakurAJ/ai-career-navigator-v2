import type { Roadmap } from "../lib/storage";

type Props = {
  roadmap: Roadmap;
  completed: string[];
  onToggle: (id: string) => void;
  onRestart: () => void;
};

export default function RoadmapView({ roadmap, completed, onToggle, onRestart }: Props) {
  const done = roadmap.milestones.filter((m) => completed.includes(m.id)).length;
  const total = roadmap.milestones.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="min-h-full max-w-3xl mx-auto px-6 py-14 animate-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-xs tracking-widest uppercase text-accent">Your roadmap</div>
          <h2 className="font-display text-4xl font-600 mt-2">{roadmap.goal}</h2>
        </div>
        <button
          onClick={onRestart}
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition self-center"
        >
          ↺ New roadmap
        </button>
      </div>

      {roadmap.summary && (
        <p className="text-muted-foreground mt-4 leading-relaxed max-w-prose">{roadmap.summary}</p>
      )}

      {/* Progress */}
      <div className="mt-8 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary">
            {done}/{total} · {pct}%
          </span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <ol className="mt-10 relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
        {roadmap.milestones.map((m, i) => {
          const isDone = completed.includes(m.id);
          return (
            <li key={m.id} className="relative pl-12 pb-8 last:pb-0">
              <button
                onClick={() => onToggle(m.id)}
                aria-pressed={isDone}
                className={`absolute left-0 top-0 grid place-items-center w-8 h-8 rounded-full border-2 font-mono text-xs transition ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </button>

              <div
                className={`rounded-lg border p-5 transition ${
                  isDone ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-card"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3
                    className={`font-display text-xl font-600 ${
                      isDone ? "text-muted-foreground line-through decoration-primary/40" : ""
                    }`}
                  >
                    {m.title}
                  </h3>
                  {m.duration && (
                    <span className="font-mono text-xs text-accent whitespace-nowrap">{m.duration}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1.5 leading-relaxed">{m.description}</p>

                {m.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {m.resources.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {m.resources.map((r) => (
                      <li key={r} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent mt-0.5">◦</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => onToggle(m.id)}
                  className={`mt-4 font-mono text-xs uppercase tracking-wider transition ${
                    isDone ? "text-muted-foreground hover:text-foreground" : "text-primary hover:opacity-70"
                  }`}
                >
                  {isDone ? "↺ Mark as not done" : "✓ Mark complete"}
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {pct === 100 && (
        <div className="mt-4 rounded-lg border border-accent/40 bg-accent/[0.06] p-5 text-center animate-fade-up">
          <div className="font-display text-2xl font-600 text-accent">Summit reached 🏔</div>
          <p className="text-muted-foreground mt-1">
            You've cleared every milestone toward {roadmap.goal}. Time to draw the next map.
          </p>
        </div>
      )}
    </div>
  );
}
