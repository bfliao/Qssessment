import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Interviewer Agent
        </h1>
        <p className="text-sm text-slate-400">
          Practice interviews with an AI interviewer. Pick a role and start
          answering.
        </p>
      </header>
      <Chat />
    </main>
  );
}
