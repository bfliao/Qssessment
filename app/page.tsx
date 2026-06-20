import { readFileSync } from "fs";
import path from "path";
import QuestionArenaPortal from "@/components/QuestionArenaPortal";
import { scenarioTemplates } from "@/lib/questionArena/scenarios";

export default function Home() {
  const defaultProcessorPrompt = readFileSync(
    path.join(process.cwd(), "prompts", "scenario-processor.md"),
    "utf8"
  );
  const defaultAnswerPrompt = readFileSync(
    path.join(process.cwd(), "prompts", "interview-answerer.md"),
    "utf8"
  );
  const defaultEvaluatorPrompt = readFileSync(
    path.join(process.cwd(), "prompts", "evaluator.md"),
    "utf8"
  );

  return (
    <main>
      <QuestionArenaPortal
        scenarios={scenarioTemplates}
        defaultProcessorPrompt={defaultProcessorPrompt}
        defaultAnswerPrompt={defaultAnswerPrompt}
        defaultEvaluatorPrompt={defaultEvaluatorPrompt}
      />
    </main>
  );
}
