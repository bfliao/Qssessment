export type ScenarioReportGroup =
  | "Discovery"
  | "Validation"
  | "Mitigation"
  | "Communication"
  | "Prevention";

export type ScenarioReportCluster =
  | "discovery"
  | "validation"
  | "mitigation"
  | "communication"
  | "prevention";

export interface ScenarioReportFact {
  id: string;
  title: string;
  fact: string;
  group: ScenarioReportGroup;
}

export interface ScenarioReportRun {
  id: string;
  candidateName: string;
  profile: string;
  label: string;
  percent: number;
  unlockedFactIds: string[];
  summary: string;
  finalRecommendation: string;
  messages: Array<{ role: "candidate" | "manager"; content: string }>;
}

export interface ScenarioReportGraphNode {
  id: string;
  label: string;
  group: ScenarioReportGroup;
  cluster: ScenarioReportCluster;
  x: number;
  y: number;
  root?: boolean;
  trap?: boolean;
}

export interface ScenarioReportData {
  scenario: {
    id: string;
    title: string;
    displayTitle: string;
    role: string;
    source?: string;
    prompt: string;
  };
  facts: ScenarioReportFact[];
  graph: {
    nodes: ScenarioReportGraphNode[];
    links: Array<[string, string]>;
  };
  runs: ScenarioReportRun[];
}
