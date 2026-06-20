export interface StoredAssessmentPackage {
  id: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  markdown: string;
  targetRole?: string;
  createdAt: string;
  scenarios?: unknown;
}

const globalForAssessments = globalThis as typeof globalThis & {
  __questionArenaAssessments?: Map<string, StoredAssessmentPackage>;
};

export const assessmentStore =
  globalForAssessments.__questionArenaAssessments ??
  new Map<string, StoredAssessmentPackage>();

globalForAssessments.__questionArenaAssessments = assessmentStore;

