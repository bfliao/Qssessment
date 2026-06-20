import { chatJSON } from "./openai";
import {
  MAX_FOLLOWUP_DEPTH,
  type Criterion,
  type CritiqueOutput,
  type Scenario,
} from "./types";

const SYSTEM_PROMPT = `You are an expert hiring rubric designer (a "critique" agent).

Given an evaluation scenario, produce a RECURSIVE scoring rubric tree that a
hiring panel can use to judge a candidate on this scenario. Do NOT simulate or
role-play the interview; only design the rubric.

Each rubric node ("criterion") has:
- "evidence": a concrete, observable signal that this criterion is met
  (what you would literally see/hear from a strong candidate).
- "tags": 1-3 short lowercase hashtags derived from the evidence
  (e.g. "cache", "redis", "prioritization"). No '#' symbol.
- "score": a number in [0,1] representing this node's relative weight AMONG ITS
  SIBLINGS. The scores of all siblings under the same parent MUST sum to 1.0.
- "followups": an array of child criteria that refine this one (same shape).
  Use [] when there is nothing to refine.

Rules:
- The top-level "criteria" array's scores must also sum to 1.0.
- Nesting depth must not exceed ${MAX_FOLLOWUP_DEPTH} levels.
- Prefer 2-5 children per node; keep evidence specific and testable.

Return STRICT JSON only:
{
  "criteria": [
    { "evidence": string, "tags": string[], "score": number, "followups": [ ... ] }
  ]
}`;

function buildUserPrompt(scenario: Scenario): string {
  return `SCENARIO BRIEF:
${scenario.brief}

FOCUS AREAS:
${scenario.focusAreas.map((f) => `- ${f}`).join("\n") || "- (none)"}

TARGET SKILLSET (for context):
${scenario.derivedFrom.skillset.map((s) => `- ${s}`).join("\n") || "- (none)"}

Design the recursive scoring rubric now.`;
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

interface RawCriterion {
  evidence?: unknown;
  tags?: unknown;
  score?: unknown;
  followups?: unknown;
}

/**
 * Normalize a raw criterion list from the model into valid Criterion nodes:
 * - coerce/clean fields and assign ids
 * - enforce MAX_FOLLOWUP_DEPTH (drop children deeper than allowed)
 * - normalize sibling scores so they sum to 1 at every level
 */
function normalizeLevel(raw: unknown, depth: number): Criterion[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const nodes: Criterion[] = raw.map((item) => {
    const c = (item ?? {}) as RawCriterion;

    const evidence = typeof c.evidence === "string" ? c.evidence.trim() : "";

    const tags = Array.isArray(c.tags)
      ? Array.from(
          new Set(
            (c.tags as unknown[])
              .map((t) => String(t).trim().replace(/^#/, "").toLowerCase())
              .filter((t) => t.length > 0)
          )
        )
      : [];

    const rawScore = typeof c.score === "number" ? c.score : Number(c.score);
    const score = Number.isFinite(rawScore) && rawScore > 0 ? rawScore : 0;

    // Enforce max depth: children only allowed while depth < MAX_FOLLOWUP_DEPTH.
    const followups =
      depth < MAX_FOLLOWUP_DEPTH ? normalizeLevel(c.followups, depth + 1) : [];

    return {
      id: makeId("crit"),
      evidence,
      tags,
      score,
      followups,
    };
  });

  // Normalize sibling scores to sum to 1 (equal split if all zero).
  const total = nodes.reduce((sum, n) => sum + n.score, 0);
  if (total > 0) {
    for (const n of nodes) n.score = round(n.score / total);
  } else {
    const even = round(1 / nodes.length);
    for (const n of nodes) n.score = even;
  }
  fixRounding(nodes);

  return nodes;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Nudge the largest sibling so the rounded scores sum to exactly 1. */
function fixRounding(nodes: Criterion[]): void {
  if (nodes.length === 0) return;
  const sum = nodes.reduce((s, n) => s + n.score, 0);
  const drift = round(1 - sum);
  if (drift !== 0) {
    const target = nodes.reduce((a, b) => (b.score >= a.score ? b : a));
    target.score = round(target.score + drift);
  }
}

interface RawCritique {
  criteria?: unknown;
}

/** Stage 2: generate the recursive scoring-rubric tree for a scenario. */
export async function critiqueScenario(
  scenario: Scenario
): Promise<CritiqueOutput> {
  const raw = await chatJSON<RawCritique>(
    SYSTEM_PROMPT,
    buildUserPrompt(scenario)
  );

  const criteria = normalizeLevel(raw.criteria, 1);
  if (criteria.length === 0) {
    throw new Error("Critique returned no criteria.");
  }

  return { scenarioId: scenario.id, criteria };
}
