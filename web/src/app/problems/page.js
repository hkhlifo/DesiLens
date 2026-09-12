import Link from "next/link";
import { problems } from "@/data/problems.js";

export default function ProblemsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <Link
                        href="/"
                        className="text-sm text-zinc-500 transition hover:text-white"
                    >
                        ← Back to DesignLens
                    </Link>


                    <div className="mt-8">
                        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                            Practice
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight">
                            Choose a design problem
                        </h1>

                        <p className="mt-3 max-w-2xl text-zinc-400">
                            Pick a problem, design your solution, and get a structured review
                            of your decisions.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {problems.map((problem) => (
                        <Link
                            key={problem.id}
                            href={`/problems/${problem.id}`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-medium group-hover:text-white">
                                        {problem.title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                                        {problem.description}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                                    {problem.difficulty}
                                </span>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-sm text-zinc-500">
                                    {problem.requirements.length} requirements
                                </span>

                                <span className="text-sm text-zinc-300 transition group-hover:translate-x-1">
                                    Start →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}