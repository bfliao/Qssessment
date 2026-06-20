"use client";

import { useState, useCallback, useEffect } from "react";
import PipelineApp from "@/components/PipelineApp";
import ScenariosTab from "@/components/ScenariosTab";
import JobsTab from "@/components/JobsTab";
import CandidatesTab from "@/components/CandidatesTab";
import type { Candidate, SavedJob, SavedScenario } from "@/scenario_generation/types";

const STORAGE_KEY = "saved_scenarios";
const JOBS_STORAGE_KEY = "saved_jobs";
const CANDIDATES_STORAGE_KEY = "saved_candidates";

function loadSaved(): SavedScenario[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function persistSaved(list: SavedScenario[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function loadJobs(): SavedJob[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || "[]"); } catch { return []; }
}
function persistJobs(list: SavedJob[]) {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(list));
}

function loadCandidates(): Candidate[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CANDIDATES_STORAGE_KEY) || "[]"); } catch { return []; }
}
function persistCandidates(list: Candidate[]) {
  localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(list));
}

type Tab = "playground" | "scenarios" | "jobs" | "candidates";
type CoreStep = "jobs" | "playground" | "candidates";

const TAB_LABELS: Record<Tab, (counts: Record<Tab, number>) => string> = {
  playground: () => "Build Assessment",
  scenarios: (c) => `Scenario Library${c.scenarios ? ` (${c.scenarios})` : ""}`,
  jobs: (c) => `Jobs${c.jobs ? ` (${c.jobs})` : ""}`,
  candidates: (c) => `Candidates${c.candidates ? ` (${c.candidates})` : ""}`,
};

const CORE_STEPS: Array<{
  tab: CoreStep;
  number: string;
  label: string;
  helper: string;
}> = [
  {
    tab: "jobs",
    number: "1",
    label: "Create a job",
    helper: "Role, JD, and team expectations",
  },
  {
    tab: "playground",
    number: "2",
    label: "Generate a scenario",
    helper: "Evidence-backed workplace task",
  },
  {
    tab: "candidates",
    number: "3",
    label: "Invite a candidate",
    helper: "Create the assessment link",
  },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeJob, setActiveJob] = useState<SavedJob | null>(null);

  useEffect(() => {
    const savedScenarios = loadSaved();
    const savedJobs = loadJobs();
    setSaved(savedScenarios);
    setJobs(savedJobs);
    setCandidates(loadCandidates());
    setActiveJob((current) => current ?? savedJobs[0] ?? null);
  }, []);

  const counts: Record<Tab, number> = {
    playground: 0,
    scenarios: saved.length,
    jobs: jobs.length,
    candidates: candidates.length,
  };

  const handleSave = useCallback((entry: SavedScenario) => {
    setSaved((prev) => {
      const next = [entry, ...prev.filter((s) => s.scenario.id !== entry.scenario.id)];
      persistSaved(next);
      return next;
    });
    setTab("candidates");
  }, []);

  const handleDelete = useCallback((scenarioId: string) => {
    setSaved((prev) => {
      const next = prev.filter((s) => s.scenario.id !== scenarioId);
      persistSaved(next);
      return next;
    });
  }, []);

  const handleSaveJob = useCallback((job: SavedJob) => {
    setJobs((prev) => {
      const next = [job, ...prev.filter((j) => j.id !== job.id)];
      persistJobs(next);
      return next;
    });
    setActiveJob(job);
    setTab("playground");
  }, []);

  const handleDeleteJob = useCallback((id: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      persistJobs(next);
      return next;
    });
  }, []);

  const handleUseJob = useCallback((job: SavedJob) => {
    setActiveJob(job);
    setTab("playground");
  }, []);

  const activeCoreStep: CoreStep =
    tab === "jobs" || tab === "playground" || tab === "candidates"
      ? tab
      : "playground";
  const completedSteps = {
    jobs: jobs.length > 0,
    playground: saved.length > 0,
    candidates: candidates.some((candidate) =>
      candidate.applications.some((app) => app.assessmentsSent.length > 0)
    ),
  };

  const handleAddCandidate = useCallback((c: Candidate) => {
    setCandidates((prev) => {
      const next = [c, ...prev];
      persistCandidates(next);
      return next;
    });
  }, []);

  const handleUpdateCandidate = useCallback((c: Candidate) => {
    setCandidates((prev) => {
      const next = prev.map((x) => (x.id === c.id ? c : x));
      persistCandidates(next);
      return next;
    });
  }, []);

  const handleDeleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persistCandidates(next);
      return next;
    });
  }, []);

  return (
    <main className="hr-shell min-h-screen px-5 py-6">
      <div className="hr-orb hr-orb-a" />
      <div className="hr-orb hr-orb-b" />

      <div className="hr-wrap">
        <header className="hr-appbar hr-glass">
          <div className="hr-wordmark">
            <span className="hr-mark" />
            ByteCoder
          </div>
          <nav className="hr-tabs" aria-label="Dashboard sections">
            {(["jobs", "playground", "candidates", "scenarios"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`hr-tab ${tab === t ? "active" : ""}`}
              >
                {TAB_LABELS[t](counts)}
              </button>
            ))}
          </nav>
        </header>

        <div className="hr-guide hr-glass">
          {CORE_STEPS.map((step) => {
            const active = activeCoreStep === step.tab;
            const complete = completedSteps[step.tab];
            return (
              <button
                key={step.tab}
                type="button"
                onClick={() => setTab(step.tab)}
                className={`hr-guide-step ${active ? "active" : ""} ${
                  complete ? "done" : ""
                }`}
              >
                <span className="hr-guide-num">
                  {complete && !active ? "✓" : step.number}
                </span>
                <div>
                  <p>{step.label}</p>
                  <small>{step.helper}</small>
                </div>
              </button>
            );
          })}
        </div>

        <section className="hr-view">
          {tab === "playground" ? (
            <PipelineApp onSave={handleSave} initialJob={activeJob} jobs={jobs} />
          ) : tab === "scenarios" ? (
            <ScenariosTab saved={saved} onDelete={handleDelete} />
          ) : tab === "jobs" ? (
            <JobsTab jobs={jobs} onSave={handleSaveJob} onDelete={handleDeleteJob} onUse={handleUseJob} />
          ) : (
            <CandidatesTab
              candidates={candidates}
              savedScenarios={saved}
              jobs={jobs}
              onAdd={handleAddCandidate}
              onUpdate={handleUpdateCandidate}
              onDelete={handleDeleteCandidate}
            />
          )}
        </section>
      </div>
    </main>
  );
}
