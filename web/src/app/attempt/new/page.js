import Link from "next/link";
import { getProblemById } from "@/data/problems";
import StartAttemptButton from "./StartAttemptButton";

export default async function NewAttemptPage({ searchParams }) {
  const params = await searchParams;
  const problemId = params?.problem;

  const problem = getProblemById(problemId);

  if (!problem) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold">
            Problem not found
          </h1>

          <Link
            href="/problems"
            className="mt-4 inline-block text-sm text-zinc-400 hover:text-white"
          >
            ← Back to problems
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/problems/${problem.id}`}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to problem
        </Link>

        <div className="mt-10">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
            {problem.difficulty}
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight">
            Ready to design?
          </h1>

          <p className="mt-4 text-lg text-zinc-400">
            {problem.title}
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            You will have a workspace to describe your requirements,
            responsibilities, relationships, design decisions and edge cases.
            Your final design will be reviewed based on the reasoning behind
            it.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-lg font-medium">
            What you will work through
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Requirements & assumptions",
              "Classes & responsibilities",
              "Relationships",
              "Design decisions",
              "Edge cases",
              "Trade-offs",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-xl border border-white/5 bg-black/20 p-4"
              >
                <span className="text-xs text-zinc-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-2 text-sm text-zinc-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <StartAttemptButton problemId={problem.id} />
        </div>
      </div>
    </main>
  );
}