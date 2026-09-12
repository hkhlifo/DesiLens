"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttemptPage() {
    const params = useParams();
    const router = useRouter();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        const stored = localStorage.getItem(
            `designlens-attempt-${params.id}`
        );

        if (stored) {
            setAttempt(JSON.parse(stored));
        }

        setLoading(false);
    }, [params?.id]);

    function updateField(field, value) {
        setAttempt((current) => ({
            ...current,
            submission: {
                ...current.submission,
                [field]: value,
            },
        }));
    }

    function saveDraft() {
        if (!attempt) return;

        setSaving(true);

        localStorage.setItem(
            `designlens-attempt-${attempt.id}`,
            JSON.stringify(attempt)
        );

        setTimeout(() => {
            setSaving(false);
        }, 400);
    }

    async function submitAttempt() {
        if (!attempt) return;

        const submission = attempt.submission;

        const isComplete =
            submission.requirements.trim() &&
            submission.classes.trim() &&
            submission.relationships.trim() &&
            submission.designDecisions.trim() &&
            submission.edgeCases.trim();

        if (!isComplete) {
            alert("Please complete all design sections before submitting.");
            return;
        }

        try {
            setSaving(true);

            const evaluatingAttempt = {
                ...attempt,
                status: "EVALUATING",
                submittedAt: new Date().toISOString(),
            };

            localStorage.setItem(
                `designlens-attempt-${attempt.id}`,
                JSON.stringify(evaluatingAttempt)
            );

            setAttempt(evaluatingAttempt);

            const response = await fetch(
                `/api/attempts/${attempt.id}/submit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        problemId: attempt.problemId,
                        submission,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Submission failed."
                );
            }

            const completedAttempt = {
                ...evaluatingAttempt,
                status: data.attempt.status,
                submission: data.submission,
                evaluation: data.evaluation,
                evaluationId: data.evaluation.id,
            };

            localStorage.setItem(
                `designlens-attempt-${attempt.id}`,
                JSON.stringify(completedAttempt)
            );

            router.push(`/attempt/${attempt.id}/result`);
        } catch (error) {
            console.error("Submission failed:", error);

            const failedAttempt = {
                ...attempt,
                status: "FAILED",
            };

            localStorage.setItem(
                `designlens-attempt-${attempt.id}`,
                JSON.stringify(failedAttempt)
            );

            setAttempt(failedAttempt);

            alert(
                error.message ||
                "Something went wrong while submitting your design."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] p-10 text-white">
                Loading attempt...
            </main>
        );
    }

    if (!attempt) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-2xl font-semibold">
                        Attempt not found
                    </h1>

                    <Link
                        href="/problems"
                        className="mt-4 inline-block text-sm text-zinc-400 hover:text-white"
                    >
                        ← Choose another problem
                    </Link>
                </div>
            </main>
        );
    }

    if (attempt.status !== "DRAFT") {
        return (
            <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-2xl font-semibold">
                        This attempt has already been submitted.
                    </h1>

                    <Link
                        href={`/attempt/${attempt.id}/result`}
                        className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
                    >
                        View review →
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <Link
                            href="/problems"
                            className="text-sm text-zinc-500 hover:text-white"
                        >
                            ← Problems
                        </Link>

                        <p className="mt-7 text-xs uppercase tracking-[0.2em] text-zinc-600">
                            Design workspace
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold">
                            Build your solution
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Explain your thinking. There is no single perfect design.
                        </p>
                    </div>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                        DRAFT
                    </span>
                </div>

                <div className="mt-10 space-y-6">
                    <DesignField
                        number="01"
                        label="Requirements & Assumptions"
                        description="What does the system need to do? What assumptions are you making?"
                        value={attempt.submission.requirements}
                        onChange={(value) =>
                            updateField("requirements", value)
                        }
                        placeholder="Describe the important functional requirements and assumptions..."
                    />

                    <DesignField
                        number="02"
                        label="Classes & Responsibilities"
                        description="Identify your main classes and explain what each one is responsible for."
                        value={attempt.submission.classes}
                        onChange={(value) =>
                            updateField("classes", value)
                        }
                        placeholder="Example: ParkingLot manages floors and availability..."
                    />

                    <DesignField
                        number="03"
                        label="Relationships"
                        description="Explain how the classes interact and depend on each other."
                        value={attempt.submission.relationships}
                        onChange={(value) =>
                            updateField("relationships", value)
                        }
                        placeholder="Describe associations, composition, dependencies or interfaces..."
                    />

                    <DesignField
                        number="04"
                        label="Design Decisions"
                        description="Explain important design choices and the trade-offs behind them."
                        value={attempt.submission.designDecisions}
                        onChange={(value) =>
                            updateField("designDecisions", value)
                        }
                        placeholder="Why did you choose this structure? What alternatives did you consider?"
                    />

                    <DesignField
                        number="05"
                        label="Edge Cases"
                        description="Think about unusual situations and how your design handles them."
                        value={attempt.submission.edgeCases}
                        onChange={(value) =>
                            updateField("edgeCases", value)
                        }
                        placeholder="Example: No suitable parking spot, duplicate request, invalid payment..."
                    />
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={saveDraft}
                        className="text-sm text-zinc-500 hover:text-white"
                    >
                        {saving ? "Saved ✓" : "Save draft"}
                    </button>

                    <button
                        onClick={submitAttempt}
                        disabled={saving}
                        className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                       {saving ? "Reviewing..." : "Submit for review →"}
                    </button>
                </div>
            </div>
        </main>
    );
}

function DesignField({
    number,
    label,
    description,
    value,
    onChange,
    placeholder,
}) {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex gap-4">
                <span className="pt-1 text-xs text-zinc-600">
                    {number}
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-medium">
                        {label}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {description}
                    </p>

                    <textarea
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={placeholder}
                        rows={7}
                        className="mt-5 w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-white/25"
                    />
                </div>
            </div>
        </section>
    );
}