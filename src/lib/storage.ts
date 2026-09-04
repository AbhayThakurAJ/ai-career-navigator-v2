export type Profile = {
  name: string;
  educationLevel: string;
  field: string;
  skills: string[];
  interests: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
};

export type Roadmap = {
  goal: string;
  summary: string;
  milestones: Milestone[];
};

export type AppState = {
  user: string | null;
  profile: Profile | null;
  roadmap: Roadmap | null;
  completed: string[];
};

const KEY = "career-navigator-state-v1";

const empty: AppState = {
  user: null,
  profile: null,
  roadmap: null,
  completed: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
