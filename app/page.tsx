import PipelineApp from "@/components/PipelineApp";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Scenario → Critique → Rubric
        </h1>
        <p className="text-sm text-slate-400">
          Turn a JD, skillset, and team input into an evaluation scenario and a
          recursive scoring rubric.
        </p>
      </header>
      <PipelineApp />
    </main>
  );
}
