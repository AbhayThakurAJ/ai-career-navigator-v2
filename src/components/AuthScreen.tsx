import { useState } from "react";

type Props = {
  onAuth: (name: string) => void;
};

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() && password.trim() && (mode === "signin" || name.trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAuth(name.trim() || email.split("@")[0]);
  }

  return (
    <div className="min-h-full grid lg:grid-cols-[1.1fr_1fr]">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 26px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 26px)",
          }}
        />
        <div className="relative font-mono text-xs tracking-widest uppercase opacity-80">
          Career Navigator
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-5xl leading-[1.05] font-600">
            Chart the route
            <br />
            from student
            <br />
            to <span className="italic text-accent">what's next.</span>
          </h1>
          <p className="mt-6 text-primary-foreground/80 leading-relaxed">
            Tell us where you are. We'll draw a personalized, milestone-by-milestone map to the
            career you're aiming for — and track your progress along the way.
          </p>
        </div>
        <div className="relative font-mono text-xs opacity-70 flex gap-6">
          <span>◇ Profile</span>
          <span>◇ Goal</span>
          <span>◇ Roadmap</span>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden font-mono text-xs tracking-widest uppercase text-accent mb-3">
            Career Navigator
          </div>
          <h2 className="font-display text-3xl font-600">
            {mode === "signup" ? "Start your map" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mt-2 mb-8">
            {mode === "signup"
              ? "Create an account to save your roadmap."
              : "Sign in to pick up where you left off."}
          </p>

          {mode === "signup" && (
            <Field label="Name" value={name} onChange={setName} placeholder="Ada Lovelace" />
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@school.edu" />
          <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 w-full rounded-md bg-primary text-primary-foreground py-3 font-500 transition hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-accent font-500 underline underline-offset-4 hover:opacity-80"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
