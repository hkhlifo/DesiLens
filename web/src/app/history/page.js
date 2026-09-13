"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProblemById } from "../../data/problems";

export default function HistoryPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHistory() {
            try {
                const response = await fetch("/api/attempts");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load history.");
                }

                setAttempts(data.attempts);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    return (
        <main className="min-h-screen bg-[#080808] text-white">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <Link
                    href="/"
                    className="text-sm text-zinc-400 transition hover:text-white"
                >
                    ← Back to DesignLens
                </Link>

                <div className="mt-10">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                        Practice history
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                        Your previous attempts
                    </h1>

                    <p className="mt-3 max-w-2xl text-zinc-400">
                        Review how your designs have evolved across different problems
                        and attempts.
                    </p>
                </div>

                <div className="mt-10">
                    {loading && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-zinc-400">
                            Loading your history...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8">
                            <p className="font-medium text-red-300">
                                Could not load history
                            </p>
                            <p className="mt-2 text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {!loading && !error && attempts.length === 0 && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                            <p className="text-zinc-300">
                                You have not completed any attempts yet.
                            </p>

                            <Link
                                href="/problems"
                                className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                            >
                                Start practicing →
                            </Link>
                        </div>
                    )}

                    {!loading && !error && attempts.length > 0 && (
                        <div className="space-y-4">
                            {attempts.map((attempt) => {
                                const problem = getProblemById(attempt.problemId);

                                return (
                                    <div
                                        key={attempt.id}
                                        className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700"
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-lg font-semibold">
                                                        {problem?.title || attempt.problemId}
                                                    </h2>

                                                    <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
                                                        {attempt.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm text-zinc-500">
                                                    {new Date(attempt.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-5">
                                                {attempt.evaluation && (
                                                    <div className="text-right">
                                                        <p className="text-2xl font-semibold">
                                                            {attempt.evaluation.overallScore}
                                                            <span className="text-sm font-normal text-zinc-500">
                                                                /100
                                                            </span>
                                                        </p>

                                                        <p className="text-xs text-zinc-500">
                                                            Design review
                                                        </p>
                                                    </div>
                                                )}

                                                <Link
                                                    href={`/attempt/${attempt.id}/result`}
                                                    className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:border-zinc-500 hover:bg-zinc-800"
                                                >
                                                    View review →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}