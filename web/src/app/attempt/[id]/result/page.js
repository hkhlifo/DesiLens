"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttemptResultPage() {
    const params = useParams();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) {
            return;
        }

        const attemptKey = `designlens-attempt-${params.id}`;

        const stored = localStorage.getItem(attemptKey);

        if (!stored) {
            setLoading(false);
            return;
        }

        try {
            const currentAttempt = JSON.parse(stored);
            setAttempt(currentAttempt);
        } catch (error) {
            console.error("Failed to read attempt:", error);
        }

        setLoading(false);
    }, [params?.id]);

    const evaluation = attempt?.evaluation;

    function ScoreCard({ score }) {
        return (
            <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                    Review score
                </p>

                <p className="mt-2 text-4xl font-semibold">
                    {score}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                    out of 100
                </p>
            </div>
        );
    }

    function FeedbackCard({ feedback }) {
        const percentage = Math.round(
            (feedback.score / feedback.maxScore) * 100
        );

        return (
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-medium">
                                {feedback.criterion}
                            </h3>

                            <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-zinc-500">
                                {feedback.score}/{feedback.maxScore}
                            </span>
                        </div>

                        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                            <div
                                className="h-full bg-white/40"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <span className="text-xs text-zinc-600">
                        Confidence{" "}
                        {Math.round((feedback.confidence ?? 0) * 100)}%
                    </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <ReviewBlock
                        label="Evidence"
                        value={feedback.evidence}
                    />

                    <ReviewBlock
                        label="Concern"
                        value={feedback.concern}
                    />

                    <ReviewBlock
                        label="Suggestion"
                        value={feedback.suggestion}
                    />
                </div>
            </article>
        );
    }

    function ReviewBlock({ label, value }) {
        return (
            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                    {label}
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {value || "No specific feedback provided."}
                </p>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-zinc-500">
                    Loading your review...
                </p>
            </main>
        );
    }

    // Attempt not found
    if (!attempt) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
                <div className="mx-auto max-w-3xl text-center pt-20">
                    <p className="text-sm text-zinc-500">
                        ATTEMPT NOT FOUND
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold">
                        We couldnt find this attempt.
                    </h1>

                    <Link
                        href="/problems"
                        className="mt-8 inline-block rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                    >
                        Back to problems
                    </Link>
                </div>
            </main>
        );
    }

    // Evaluation failed
    if (attempt.status === "FAILED") {
        return (
            <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
                <div className="mx-auto max-w-3xl text-center pt-20">
                    <p className="text-sm text-red-400">
                        REVIEW FAILED
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold">
                        We couldnt review this design.
                    </h1>

                    <p className="mt-4 text-zinc-500">
                        Please try submitting your design again.
                    </p>

                    <Link
                        href={`/attempt/${attempt.id}`}
                        className="mt-8 inline-block rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                    >
                        Return to attempt
                    </Link>
                </div>
            </main>
        );
    }

    // Evaluation missing
    if (!evaluation) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
                <div className="mx-auto max-w-3xl text-center pt-20">
                    <p className="text-sm text-amber-400">
                        REVIEW IN PROGRESS
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold">
                        Your design is being reviewed.
                    </h1>

                    <p className="mt-4 text-zinc-500">
                        The evaluation result is not available yet.
                    </p>

                    <Link
                        href={`/attempt/${attempt.id}`}
                        className="mt-8 inline-block rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 hover:bg-white/5"
                    >
                        Back to attempt
                    </Link>
                </div>
            </main>
        );
    }

    // Main review page
    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link
                            href="/problems"
                            className="text-sm text-zinc-600 hover:text-white"
                        >
                            ← Problems
                        </Link>

                        <p className="mt-8 text-sm uppercase tracking-[0.15em] text-emerald-400">
                            Design Review
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            Understand your design.
                        </h1>

                        <p className="mt-3 max-w-2xl text-zinc-500">
                            Your submission was reviewed against the DesignLens
                            evaluation criteria.
                        </p>
                    </div>

                    <ScoreCard score={evaluation.overallScore} />
                </div>

                {/* Summary */}
                <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                        Review summary
                    </p>

                    <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
                        {evaluation.summary}
                    </p>
                </section>

                {/* Strengths */}
                {evaluation.strengths?.length > 0 && (
                    <section className="mt-8">
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                            Strengths
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {evaluation.strengths.map((strength) => (
                                <div
                                    key={strength}
                                    className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] px-4 py-3 text-sm text-zinc-300"
                                >
                                    ✓ {strength}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Priority improvements */}
                {evaluation.priorityImprovements?.length > 0 && (
                    <section className="mt-8">
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                            Priority improvements
                        </p>

                        <div className="mt-4 space-y-3">
                            {evaluation.priorityImprovements.map(
                                (improvement, index) => (
                                    <div
                                        key={`${improvement}-${index}`}
                                        className="rounded-xl border border-amber-400/10 bg-amber-400/[0.03] px-4 py-4 text-sm leading-6 text-zinc-400"
                                    >
                                        <span className="mr-3 text-amber-400">
                                            {index + 1}
                                        </span>
                                        {improvement}
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* Detailed feedback */}
                <section className="mt-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                            Detailed review
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                            Eight design lenses
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Each criterion includes evidence from your submission,
                            the concern identified, and a practical suggestion.
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {evaluation.feedback?.map((feedback) => (
                            <FeedbackCard
                                key={feedback.criterion}
                                feedback={feedback}
                            />
                        ))}
                    </div>
                </section>

                {/* Change Test */}
                <section className="mt-12 rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-6">
                    <p className="text-xs uppercase tracking-[0.15em] text-amber-400">
                        Next challenge
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Can your design handle change?
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                        Your design should not only work for todays requirements.
                        Test how your decisions respond when the requirements change.
                    </p>

                    <Link
                        href={`/attempt/${attempt.id}/change-test`}
                        className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                    >
                        Take the Change Test →
                    </Link>
                </section>

                {/* Bottom navigation */}
                <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
                    <Link
                        href={`/attempt/${attempt.id}`}
                        className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 hover:bg-white/5"
                    >
                        Review my submission
                    </Link>

                    <Link
                        href="/problems"
                        className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 hover:bg-white/5"
                    >
                        Try another problem
                    </Link>
                </div>

            </div>
        </main>
    );
}