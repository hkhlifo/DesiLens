import { db } from "../../../../prisma/db.ts";

export const runtime = "nodejs";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const attempts = await db.orm.public.Attempt.all();
        const submissions = await db.orm.public.Submission.all();
        const evaluations = await db.orm.public.Evaluation.all();
        const feedback = await db.orm.public.Feedback.all();

        const attempt = attempts.find((item) => item.id === id);

        if (!attempt) {
            return Response.json(
                { error: "Attempt not found." },
                { status: 404 }
            );
        }

        const submission = submissions.find(
            (item) => item.attemptId === id
        );

        const evaluation = evaluations.find(
            (item) => item.attemptId === id
        );

        const evaluationFeedback = evaluation
            ? feedback.filter(
                (item) => item.evaluationId === evaluation.id
            )
            : [];

        return Response.json({
            attempt,
            submission: submission || null,
            evaluation: evaluation
                ? {
                    ...evaluation,
                    feedback: evaluationFeedback,
                }
                : null,
        });
    } catch (error) {
        console.error("Failed to load attempt review:", error);

        return Response.json(
            { error: "Failed to load attempt review." },
            { status: 500 }
        );
    }
}