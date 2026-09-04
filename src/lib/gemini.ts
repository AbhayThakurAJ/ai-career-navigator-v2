import type { Profile, Roadmap, Milestone } from "./storage";

// Correct, currently-available model. (Previous bug: "gemini-3-flash-preview" does not exist.)
const MODEL = "gemini-2.0-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

function buildPrompt(profile: Profile, goal: string): string {
  return `You are a career mentor. Build a personalized, realistic career roadmap.

Student profile:
- Name: ${profile.name}
- Education level: ${profile.educationLevel}
- Field of study: ${profile.field}
- Current skills: ${profile.skills.join(", ") || "none listed"}
- Interests: ${profile.interests || "not specified"}

Target career goal: ${goal}

Respond with ONLY valid JSON (no markdown fences) matching exactly this shape:
{
  "summary": "one or two encouraging sentences tailored to this student",
  "milestones": [
    {
      "title": "short phase title",
      "description": "1-2 sentences on what to do and why",
      "duration": "e.g. 1-2 months",
      "skills": ["skill", "skill"],
      "resources": ["specific resource or activity", "another"]
    }
  ]
}
Include 5 to 6 milestones ordered from beginner to job-ready.`;
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

let idCounter = 0;
const nextId = () => `m-${Date.now()}-${idCounter++}`;

function normalize(raw: any, goal: string): Roadmap {
  const milestones: Milestone[] = (raw.milestones ?? []).map((m: any) => ({
    id: nextId(),
    title: String(m.title ?? "Milestone"),
    description: String(m.description ?? ""),
    duration: String(m.duration ?? ""),
    skills: Array.isArray(m.skills) ? m.skills.map(String) : [],
    resources: Array.isArray(m.resources) ? m.resources.map(String) : [],
  }));
  return { goal, summary: String(raw.summary ?? ""), milestones };
}

export async function generateRoadmap(profile: Profile, goal: string): Promise<Roadmap> {
  if (!API_KEY) {
    return fallbackRoadmap(profile, goal);
  }

  const res = await fetch(ENDPOINT(API_KEY), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(profile, goal) }] }],
      generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed (${res.status}). ${await res.text()}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return normalize(extractJson(text), goal);
}

// Deterministic local roadmap so the app is fully usable without an API key.
export function fallbackRoadmap(profile: Profile, goal: string): Roadmap {
  const g = goal.toLowerCase();
  const foundation = profile.skills[0] ?? profile.field ?? "the fundamentals";
  const base: Omit<Milestone, "id">[] = [
    {
      title: "Map the terrain",
      description: `Survey what "${goal}" actually involves day to day and audit how ${foundation} gives you a head start.`,
      duration: "2-3 weeks",
      skills: ["research", "self-assessment"],
      resources: ["Informational interview with one professional", "Read 3 recent job listings"],
    },
    {
      title: "Build the base camp",
      description: "Close the biggest skill gap between where you are and an entry-level role.",
      duration: "1-2 months",
      skills: [g.includes("data") ? "Python & SQL" : g.includes("design") ? "Figma" : "core tooling", "fundamentals"],
      resources: ["One structured online course", "Daily 30-minute practice habit"],
    },
    {
      title: "Ship something small",
      description: "Turn learning into a portfolio piece that a stranger could evaluate.",
      duration: "3-4 weeks",
      skills: ["applied practice", "documentation"],
      resources: ["Publish one project to GitHub or a portfolio site", "Write a short case study"],
    },
    {
      title: "Join the expedition",
      description: "Get feedback from people already in the field and grow your network.",
      duration: "ongoing",
      skills: ["communication", "networking"],
      resources: ["Join 2 relevant communities", "Share progress publicly each week"],
    },
    {
      title: "Prove readiness",
      description: "Assemble evidence and practice the interview loop for this role.",
      duration: "1 month",
      skills: ["interviewing", "portfolio polish"],
      resources: ["Mock interviews", "Refine résumé around the goal"],
    },
    {
      title: "Reach the summit",
      description: `Apply with intent, track outcomes, and iterate toward your ${goal} role.`,
      duration: "1-3 months",
      skills: ["applications", "negotiation"],
      resources: ["Apply to 5 roles weekly", "Track and review every response"],
    },
  ];

  let counter = 0;
  return {
    goal,
    summary: `A hand-drawn route from ${profile.name || "you"} today to ${goal}. Take it one leg at a time — momentum compounds.`,
    milestones: base.map((m) => ({ ...m, id: `fb-${counter++}` })),
  };
}
