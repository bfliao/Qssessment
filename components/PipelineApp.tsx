"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  FlaskConical,
} from "lucide-react";
import type {
  Criterion,
  CritiqueOutput,
  DesiredCoworker,
  Scenario,
} from "@/scenario_generation/types";
import {
  MOCK_INPUT,
  MOCK_SCENARIO,
  MOCK_CRITIQUE,
} from "@/scenario_generation/mock";

type Member = DesiredCoworker;

export default function PipelineApp() {
  const [jd, setJd] = useState(MOCK_INPUT.jd);
  const [skillset, setSkillset] = useState(MOCK_INPUT.skillset.join(", "));
  const [members, setMembers] = useState<Member[]>(MOCK_INPUT.teamInput);
  const [useMock, setUseMock] = useState(true);

  const [loading, setLoading] = useState<null | "scenario" | "critique">(null);
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [critique, setCritique] = useState<CritiqueOutput | null>(null);

  function updateMember(i: number, patch: Partial<Member>) {
    setMembers((ms) => ms.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }
  function addMember() {
    setMembers((ms) => [
      ...ms,
      { memberId: `m${ms.length + 1}`, memberName: "", description: "" },
    ]);
  }
  function removeMember(i: number) {
    setMembers((ms) => ms.filter((_, idx) => idx !== i));
  }

  function buildInput() {
    return {
      jd,
      skillset: skillset
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      teamInput: members.filter((m) => m.description.trim()),
    };
  }

  async function generateScenario() {
    setError(null);
    setCritique(null);
    if (useMock) {
      setScenario(MOCK_SCENARIO);
      return;
    }
    setLoading("scenario");
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInput()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate scenario.");
      setScenario(data.scenario);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  async function runCritique() {
    if (!scenario) return;
    setError(null);
    if (useMock) {
      setCritique({ ...MOCK_CRITIQUE, scenarioId: scenario.id });
      return;
    }
    setLoading("critique");
    try {
      const res = await fetch("/api/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to run critique.");
      setCritique(data.critique);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ---- Input column ---- */}
      <section className="space-y-4 rounded-xl border border-slate-800 bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Inputs</h2>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
              className="accent-accent"
            />
            <FlaskConical className="h-3.5 w-3.5" />
            Use mock (no API key)
          </label>
        </div>

        <Field label="Job Description">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
            className="input"
            placeholder="Paste the JD..."
          />
        </Field>

        <Field label="Skillset (comma separated)">
          <input
            value={skillset}
            onChange={(e) => setSkillset(e.target.value)}
            className="input"
            placeholder="distributed systems, debugging, ..."
          />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">
              Team input (each member&apos;s desired coworker)
            </span>
            <button onClick={addMember} className="btn-ghost">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {members.map((m, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-slate-800 bg-background p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  value={m.memberName ?? ""}
                  onChange={(e) =>
                    updateMember(i, { memberName: e.target.value })
                  }
                  className="input flex-1"
                  placeholder="Member name (optional)"
                />
                <button
                  onClick={() => removeMember(i)}
                  className="text-slate-500 hover:text-red-400"
                  aria-label="Remove member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={m.description}
                onChange={(e) =>
                  updateMember(i, { description: e.target.value })
                }
                rows={2}
                className="input"
                placeholder="Describe your ideal coworker..."
              />
            </div>
          ))}
        </div>

        <button
          onClick={generateScenario}
          disabled={loading !== null || !jd.trim()}
          className="btn-primary w-full"
        >
          {loading === "scenario" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate scenario
        </button>
      </section>

      {/* ---- Output column ---- */}
      <section className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {scenario ? (
          <div className="space-y-4 rounded-xl border border-slate-800 bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-medium">Scenario</h2>
              <button
                onClick={runCritique}
                disabled={loading !== null}
                className="btn-primary shrink-0"
              >
                {loading === "critique" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Run critique
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {scenario.brief}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scenario.focusAreas.map((f) => (
                <Tag key={f}>{f}</Tag>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
            Generate a scenario to begin.
          </div>
        )}

        {critique && (
          <div className="space-y-3 rounded-xl border border-slate-800 bg-surface p-5">
            <h2 className="text-lg font-medium">Scoring rubric</h2>
            <p className="text-xs text-slate-500">
              Sibling weights sum to 1 at each level. Path product = absolute
              weight in the tree.
            </p>
            <CriterionTree nodes={critique.criteria} depth={0} />
          </div>
        )}
      </section>
    </div>
  );
}

function CriterionTree({
  nodes,
  depth,
}: {
  nodes: Criterion[];
  depth: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-4 space-y-2 border-l border-slate-800 pl-4" : "space-y-2"}>
      {nodes.map((n) => (
        <li key={n.id} className="space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 rounded bg-accent/15 px-1.5 py-0.5 font-mono text-xs text-accent">
              {n.score.toFixed(2)}
            </span>
            <div className="space-y-1">
              <p className="text-sm text-slate-200">{n.evidence}</p>
              <div className="flex flex-wrap gap-1">
                {n.tags.map((t) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </div>
            </div>
          </div>
          {n.followups.length > 0 && (
            <CriterionTree nodes={n.followups} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-700 bg-background px-2 py-0.5 text-xs text-slate-400">
      {children}
    </span>
  );
}
