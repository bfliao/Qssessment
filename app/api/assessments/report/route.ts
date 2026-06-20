import { NextRequest, NextResponse } from "next/server";
import { getAssessment, saveAssessment } from "@/lib/assessmentStore";
import { buildManagerScenarioReport } from "@/lib/managerReport/buildReport";
import type {
  Message,
  ScenarioConfig,
  ValidatorReport,
} from "@/lib/questionArena/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as {
    assessmentId?: string;
    scenario?: ScenarioConfig;
    candidateName?: string;
    messages?: Message[];
    unlockedFactIds?: string[];
    finalRecommendation?: string;
    validatorReport?: ValidatorReport;
  };

  if (!payload.assessmentId) {
    return NextResponse.json({ error: "assessmentId is required." }, { status: 400 });
  }
  if (!payload.scenario || !payload.validatorReport) {
    return NextResponse.json(
      { error: "scenario and validatorReport are required." },
      { status: 400 }
    );
  }

  const existing = getAssessment(payload.assessmentId);
  if (!existing) {
    return NextResponse.json(
      { error: `Assessment ${payload.assessmentId} was not found.` },
      { status: 404 }
    );
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const unlockedFactIds = Array.isArray(payload.unlockedFactIds)
    ? payload.unlockedFactIds
    : [];
  const finalRecommendation = payload.finalRecommendation || "";
  const managerReport = buildManagerScenarioReport({
    scenario: payload.scenario,
    candidateName:
      payload.candidateName || existing.candidateName || "Candidate",
    messages,
    unlockedFactIds,
    finalRecommendation,
    validatorReport: payload.validatorReport,
  });
  const now = new Date().toISOString();
  const updated = {
    ...existing,
    status: "report_ready" as const,
    submittedAt: existing.submittedAt || now,
    reportGeneratedAt: now,
    finalRecommendation,
    managerReport,
    validatorReport: payload.validatorReport,
  };

  saveAssessment(updated);

  return NextResponse.json({ ok: true, assessment: updated, managerReport });
}
