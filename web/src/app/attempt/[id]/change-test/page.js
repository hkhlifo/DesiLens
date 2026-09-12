"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChangeTestByProblemId } from "@/data/changeTests";
import { getProblemById } from "@/data/problems";

export default function ChangeTestPage() {
    const params = useParams();

    const [attempt, setAttempt] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!params?.id) return;

        const stored = localStorage.getItem(
            `designlens-attempt-${params.id}`
        );

        if (stored) {
            const currentAttempt = JSON.parse(stored);
            setAttempt(currentAttempt);

            const changeTest = getChangeTestByProblemId(
                currentAttempt.problemId
            );

            setAnswers(
                changeTest.questions.map(() => "")
            );
        }

        setLoading(false);
    }, [params?.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                Loading change test...
            </main>
        );
    }

    if (!attempt) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">
                        Attempt not found
                    </h1>

                    <Link
                        href="/problems"
                        className="mt-4 inline-block text-zinc-400 hover:text-white"
                    >
                        Back to problems
                    </Link>
                </div>
            </main>
        );
    }

    const problem = getProblemById(attempt.problemId);
    const changeTest = getChangeTestByProblemId(attempt.problemId);

    function updateAnswer(index, value) {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    }

    function handleSubmit() {
        const complete = answers.every(
            (answer) => answer.trim().length > 0
        );

        if (!complete) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const updatedAttempt = {
            ...attempt,
            changeTest: {
                answers,
                completedAt: new Date().toISOString(),
            },
        };

        localStorage.setItem(
            `designlens-attempt-${attempt.id}`,
            JSON.stringify(updatedAttempt)
        );

        setAttempt(updatedAttempt);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
                <div className="mx-auto max-w-3xl">
                    <p className="text-sm text-emerald-400">
                        CHANGE TEST COMPLETED
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold">
                        Good. Now review your thinking.
                    </h1>

                    <p className="mt-4 text-zinc-400">
                        Your answers show how your design would respond to
                        changing requirements.
                    </p>

                    <div className="mt-8 space-y-4">
                        {changeTest.questions.map((question, index) => (
                            <div
                                key={question}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <p className="text-sm text-zinc-500">
                                    Question {index + 1}
                                </p>

                                <h2 className="mt-2 font-medium">
                                    {question}
                                </h2>

                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                                    {answers[index]}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Link
                            href={`/attempt/${attempt.id}/result`}
                            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                        >
                            Back to review
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

    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <Link
                    href={`/attempt/${attempt.id}/result`}
                    className="text-sm text-zinc-500 hover:text-white"
                >
                    ← Back to review
                </Link>

                <p className="mt-10 text-sm text-amber-400">
                    CHANGE TEST
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                    Can your design handle change?
                </h1>

                <p className="mt-3 text-zinc-400">
                    {problem?.title}
                </p>

                <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
                    <p className="text-sm font-medium text-amber-300">
                        Requirement changed
                    </p>

                    <p className="mt-3 leading-7 text-zinc-300">
                        {changeTest.scenario}
                    </p>
                </div>

                <div className="mt-8 space-y-8">
                    {changeTest.questions.map((question, index) => (
                        <div key={question}>
                            <label className="block text-sm font-medium text-zinc-200">
                                {index + 1}. {question}
                            </label>

                            <textarea
                                value={answers[index]}
                                onChange={(event) =>
                                    updateAnswer(index, event.target.value)
                                }
                                placeholder="Explain your reasoning..."
                                rows={5}
                                className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-10 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                >
                    Submit change test →
                </button>
            </div>
        </main>
    );
}