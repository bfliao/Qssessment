import { NextResponse } from "next/server";
import { critiqueScenario } from "@/scenario_generation/critique";
import type { Scenario } from "@/scenario_generation/types";

export const runtime = "nodejs";

function isScenario(v: unknown): v is Scenario {
  const s = v as Scenario | null;
  return (
    !!s &&
    typeof s.id === "string" &&
    typeof s.brief === "string" &&
    Array.isArray(s.focusAreas) &&
    !!s.derivedFrom
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const scenario = (body as { scenario?: unknown })?.scenario;
  if (!isScenario(scenario)) {
    return NextResponse.json(
      { error: "`scenario` (from /api/scenario) is required." },
      { status: 400 }
    );
  }

  try {
    const critique = await critiqueScenario(scenario);
    return NextResponse.json({ critique });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("OPENAI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
