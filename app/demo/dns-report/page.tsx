import { ScenarioReportView } from "@/components/ScenarioReportView";
import reportData from "@/data/demo/dns-report.json";
import type { ScenarioReportData } from "@/lib/managerReport/types";

export default function DnsReportDemoPage() {
  return <ScenarioReportView data={reportData as ScenarioReportData} />;
}
