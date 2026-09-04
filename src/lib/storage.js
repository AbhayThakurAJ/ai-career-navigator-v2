// App state shape (for reference):
//   user:      string | null
//   profile:   { name, educationLevel, field, skills[], interests } | null
//   roadmap:   { goal, summary, milestones[] } | null
//   completed: string[]   (ids of finished milestones)

const KEY = "career-navigator-state-v1";

const empty = {
  user: null,
  profile: null,
  roadmap: null,
  completed: [],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
