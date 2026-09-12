"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartAttemptButton({ problemId }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  function handleStart() {
    setStarting(true);

    const attemptId = crypto.randomUUID();

    const attempt = {
      id: attemptId,
      problemId,
      status: "DRAFT",
      submission: {
        requirements: "",
        classes: "",
        relationships: "",
        designDecisions: "",
        edgeCases: "",
      },
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `designlens-attempt-${attemptId}`,
      JSON.stringify(attempt)
    );

    router.push(`/attempt/${attemptId}`);
  }

  return (
    <button
      onClick={handleStart}
      disabled={starting}
      className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {starting ? "Starting..." : "Start attempt →"}
    </button>
  );
}