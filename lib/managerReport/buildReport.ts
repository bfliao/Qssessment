import type {
  HiddenFact,
  Message,
  ScenarioConfig,
  ValidatorReport,
} from "@/lib/questionArena/types";
import type {
  ScenarioReportCluster,
  ScenarioReportData,
  ScenarioReportFact,
  ScenarioReportGraphNode,
  ScenarioReportGroup,
} from "@/lib/managerReport/types";

const GROUP_TO_CLUSTER: Record<ScenarioReportGroup, ScenarioReportCluster> = {
  Discovery: "discovery",
  Validation: "validation",
  Mitigation: "mitigation",
  Communication: "communication",
  Prevention: "prevention",
};

const GROUP_POSITIONS: Record<ScenarioReportGroup, Array<[number, number]>> = {
  Discovery: [
    [140, 135],
    [235, 205],
    [185, 275],
  ],
  Validation: [
    [340, 145],
    [438, 210],
    [515, 135],
    [545, 270],
  ],
  Mitigation: [
    [205, 315],
    [300, 360],
    [115, 355],
  ],
  Communication: [
    [620, 330],
    [690, 250],
  ],
  Prevention: [
    [655, 145],
    [700, 90],
    [620, 55],
  ],
};

function groupFromFact(fact: HiddenFact): ScenarioReportGroup {
  const text = `${fact.category} ${fact.title} ${fact.fact}`.toLowerCase();
  if (/(mitigat|stabil|rollback|failover|stop|contain|right now)/.test(text)) {
    return "Mitigation";
  }
  if (/(communicat|stakeholder|customer|impact|support|status)/.test(text)) {
    return "Communication";
  }
  if (/(prevent|monitor|alert|test|validation|process|document|review)/.test(text)) {
    return "Prevention";
  }
  if (/(root|cause|confirm|validate|evidence|hypothesis|debug|trace)/.test(text)) {
    return "Validation";
  }
  return "Discovery";
}

function shortLabel(fact: HiddenFact) {
  return fact.title
    .replace(/^Reads?\s+/i, "")
    .replace(/^Identifies?\s+/i, "")
    .replace(/^Explains?\s+/i, "")
    .trim()
    .slice(0, 24);
}

function reportFacts(scenario: ScenarioConfig): ScenarioReportFact[] {
  return scenario.hiddenFacts.map((fact) => ({
    id: fact.id,
    title: fact.title,
    fact: fact.fact,
    group: groupFromFact(fact),
  }));
}

function reportNodes(
  scenario: ScenarioConfig,
  unlockedFactIds: string[],
  report: ValidatorReport
): ScenarioReportGraphNode[] {
  const unlocked = new Set(unlockedFactIds);
  const missed = new Set(report.deterministic.missedFacts.map((fact) => fact.id));
  const prioritized = [...scenario.hiddenFacts]
    .sort((a, b) => {
      const aScore = (unlocked.has(a.id) ? 4 : 0) + (missed.has(a.id) ? 2 : 0) + a.weight;
      const bScore = (unlocked.has(b.id) ? 4 : 0) + (missed.has(b.id) ? 2 : 0) + b.weight;
      return bScore - aScore;
    })
    .slice(0, 14);

  const groupCounts: Partial<Record<ScenarioReportGroup, number>> = {};
  const rootFactIds = new Set(
    prioritized
      .filter((fact) => /(root|cause|critical|decision|must)/i.test(`${fact.title} ${fact.whyItMatters}`))
      .slice(0, 2)
      .map((fact) => fact.id)
  );

  return prioritized.map((fact, index) => {
    const group = groupFromFact(fact);
    const positions = GROUP_POSITIONS[group];
    const used = groupCounts[group] ?? 0;
    groupCounts[group] = used + 1;
    const [x, y] = positions[used % positions.length] ?? [
      130 + (index % 5) * 120,
      120 + Math.floor(index / 5) * 90,
    ];

    return {
      id: fact.id,
      label: shortLabel(fact),
      group,
      cluster: GROUP_TO_CLUSTER[group],
      x,
      y,
      root: rootFactIds.has(fact.id) || fact.weight >= 2,
      trap: false,
    };
  });
}

function reportLinks(nodes: ScenarioReportGraphNode[]): Array<[string, string]> {
  const links: Array<[string, string]> = [];
  for (let index = 1; index < nodes.length; index += 1) {
    links.push([nodes[index - 1].id, nodes[index].id]);
  }
  return links;
}

export function buildManagerScenarioReport({
  scenario,
  candidateName,
  messages,
  unlockedFactIds,
  finalRecommendation,
  validatorReport,
}: {
  scenario: ScenarioConfig;
  candidateName: string;
  messages: Message[];
  unlockedFactIds: string[];
  finalRecommendation: string;
  validatorReport: ValidatorReport;
}): ScenarioReportData {
  const nodes = reportNodes(scenario, unlockedFactIds, validatorReport);

  return {
    scenario: {
      id: scenario.id,
      title: scenario.title,
      displayTitle: scenario.title,
      role: scenario.role,
      source: "Generated from candidate assessment submission",
      prompt: scenario.candidatePrompt,
    },
    facts: reportFacts(scenario),
    graph: {
      nodes,
      links: reportLinks(nodes),
    },
    runs: [
      {
        id: "current-candidate-run",
        candidateName,
        profile: "Completed candidate run. This profile is a lightweight placeholder for the manager dashboard.",
        label: validatorReport.assessment.label,
        percent: validatorReport.deterministic.percent,
        unlockedFactIds,
        summary: validatorReport.assessment.summary,
        finalRecommendation,
        messages,
      },
    ],
  };
}
