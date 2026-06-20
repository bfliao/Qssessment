import emptyCartScenario from "@/data/scenarios/forkly-empty-cart.json";
import orderHistoryScenario from "@/data/scenarios/forkly-order-history.json";
import userApiExportConnectionLeakScenario from "@/data/scenarios/user-api-export-connection-leak.json";
import type { ScenarioConfig } from "./types";

export const scenarioTemplates: ScenarioConfig[] = [
  userApiExportConnectionLeakScenario as ScenarioConfig,
  orderHistoryScenario as ScenarioConfig,
  emptyCartScenario as ScenarioConfig,
];
