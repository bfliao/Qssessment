import { chatJSON } from "./openai";
import type { PipelineInput, Scenario } from "./types";

const SYSTEM_PROMPT = `You are an expert hiring scenario designer.

Given a job description (JD), a target skillset, and each team member's
description of their desired coworker, design ONE realistic, ambiguous work
scenario that can be used to evaluate a candidate.

Requirements for the scenario:
- It should be a concrete, realistic situation the candidate would plausibly
  face on the job (e.g. a production incident, an ambiguous product decision,
  a cross-team conflict).
- It must be ambiguous enough that a strong candidate needs to ask clarifying
  questions and reason under uncertainty.
- It should give room to surface the target skillset and the qualities the team
  cares about, without naming them explicitly.
- Keep the brief tight: a few short paragraphs at most.

Return STRICT JSON only, matching this shape:
{
  "brief": string,            // the scenario text shown to the candidate
  "focusAreas": string[]      // 3-6 short labels of what this scenario probes
}`;

function buildUserPrompt(input: PipelineInput): string {
  const team = input.teamInput
    .map(
      (m, i) =>
        `- ${m.memberName || `Member ${i + 1}`}: ${m.description.trim()}`
    )
    .join("\n");

  return `JOB DESCRIPTION:
${input.jd.trim()}

TARGET SKILLSET:
${input.skillset.map((s) => `- ${s}`).join("\n")}

TEAM MEMBERS' DESIRED COWORKER:
${team || "- (none provided)"}

Design the evaluation scenario now.`;
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

interface ScenarioDraft {
  brief: string;
  focusAreas: string[];
}

/** Stage 1: generate an ambiguous evaluation scenario from the pipeline input. */
export async function generateScenario(
  input: PipelineInput
): Promise<Scenario> {
  const draft = await chatJSON<ScenarioDraft>(
    SYSTEM_PROMPT,
    buildUserPrompt(input)
  );

  const brief = (draft.brief || "").trim();
  if (!brief) {
    throw new Error("Scenario generation returned an empty brief.");
  }

  return {
    id: makeId("scn"),
    brief,
    focusAreas: Array.isArray(draft.focusAreas) ? draft.focusAreas : [],
    derivedFrom: input,
    createdAt: new Date().toISOString(),
  };
}
