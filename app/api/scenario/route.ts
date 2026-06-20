import { NextResponse } from "next/server";
import { generateScenario } from "@/scenario_generation/scenario";
import type { DesiredCoworker, PipelineInput } from "@/scenario_generation/types";

export const runtime = "nodejs";

function normalizeInput(body: unknown): PipelineInput {
  const b = (body ?? {}) as Record<string, unknown>;

  const jd = typeof b.jd === "string" ? b.jd : "";

  const skillset = Array.isArray(b.skillset)
    ? (b.skillset as unknown[]).map(String).filter((s) => s.trim().length > 0)
    : [];

  const teamInput: DesiredCoworker[] = Array.isArray(b.teamInput)
    ? (b.teamInput as unknown[])
        .map((m, i) => {
          const mm = (m ?? {}) as Record<string, unknown>;
          return {
            memberId:
              typeof mm.memberId === "string" ? mm.memberId : `member_${i + 1}`,
            memberName:
              typeof mm.memberName === "string" ? mm.memberName : undefined,
            description:
              typeof mm.description === "string" ? mm.description : "",
          } satisfies DesiredCoworker;
        })
        .filter((m) => m.description.trim().length > 0)
    : [];

  return { jd, skillset, teamInput };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input = normalizeInput(body);
  if (!input.jd.trim()) {
    return NextResponse.json(
      { error: "`jd` is required." },
      { status: 400 }
    );
  }

  try {
    const scenario = await generateScenario(input);
    return NextResponse.json({ scenario });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("OPENAI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
