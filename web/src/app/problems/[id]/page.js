import Link from "next/link";
import { notFound } from "next/navigation";
import { getProblemById } from "@/data/problems";

export default async function ProblemPage({ params }) {
    const { id } = await params;

    const problem = getProblemById(id);

    if (!problem) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/problems"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to problems
                </Link>

                <div className="mt-10">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                            {problem.difficulty}
                        </span>

                        <span className="text-sm text-zinc-600">
                            {problem.requirements.length} requirements
                        </span>
                    </div>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight">
                        {problem.title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                        {problem.description}
                    </p>
                </div>

                <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                    <h2 className="text-lg font-medium">
                        Problem requirements
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        Think through these requirements before designing your solution.
                    </p>

                    <div className="mt-6 space-y-4">
                        {problem.requirements.map((requirement, index) => (
                            <div
                                key={requirement}
                                className="flex gap-4 rounded-xl border border-white/5 bg-black/20 p-4"
                            >
                                <span className="text-sm text-zinc-600">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <p className="text-sm leading-6 text-zinc-300">
                                    {requirement}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                    <h2 className="text-lg font-medium">
                        Before you start
                    </h2>

                    <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
                        <p>
                            There is no single perfect design. Your solution will be
                            reviewed based on the reasoning behind your design.
                        </p>

                        <p>
                            Focus on responsibilities, relationships, extensibility,
                            edge cases, and the trade-offs you make.
                        </p>
                    </div>
                </section>

                <div className="mt-8 flex justify-end">
                    <Link
                        href={`/attempt/new?problem=${problem.id}`}
                        className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                        Start designing →
                    </Link>
                </div>
            </div>
        </main>
    );
}