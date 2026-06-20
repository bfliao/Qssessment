import { NextRequest, NextResponse } from "next/server";
import {
  getAssessment,
  saveAssessment,
  type StoredAssessmentPackage,
} from "@/lib/assessmentStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing assessment id." }, { status: 400 });
  }

  const assessment = getAssessment(id);
  if (!assessment) {
    return NextResponse.json(
      { error: `Assessment ${id} was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ assessment });
}

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Partial<StoredAssessmentPackage>;
  if (!payload.id || !payload.markdown) {
    return NextResponse.json(
      { error: "Assessment package must include id and markdown." },
      { status: 400 }
    );
  }

  const assessment: StoredAssessmentPackage = {
    id: payload.id,
    candidateName: payload.candidateName,
    candidateEmail: payload.candidateEmail,
    jobId: payload.jobId,
    jobTitle: payload.jobTitle,
    targetRole: payload.targetRole,
    markdown: payload.markdown,
    createdAt: payload.createdAt || new Date().toISOString(),
    status: payload.status || "sent",
    submittedAt: payload.submittedAt,
    reportGeneratedAt: payload.reportGeneratedAt,
    finalRecommendation: payload.finalRecommendation,
    managerReport: payload.managerReport,
    validatorReport: payload.validatorReport,
    scenarios: payload.scenarios,
    assessmentScenarios: payload.assessmentScenarios,
  };

  saveAssessment(assessment);

  return NextResponse.json({ ok: true, assessment });
}
