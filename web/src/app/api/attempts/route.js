import { db } from "../../../prisma/db.ts";

export const runtime = "nodejs";

export async function GET() {
    try {
        const attempts = await db.orm.public.Attempt.all();
        const evaluations = await db.orm.public.Evaluation.all();

        const history = attempts
            .map((attempt) => {
                const evaluation = evaluations.find(
                    (item) => item.attemptId === attempt.id
                );

                return {
                    id: attempt.id,
                    problemId: attempt.problemId,
                    status: attempt.status,
                    createdAt: attempt.createdAt,
                    submittedAt: attempt.submittedAt,
                    evaluation: evaluation
                        ? {
                            id: evaluation.id,
                            status: evaluation.status,
                            overallScore: evaluation.overallScore,
                            summary: evaluation.summary,
                        }
                        : null,
                };
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
            );

        return Response.json({ attempts: history });
    } catch (error) {
        console.error("Failed to load attempt history:", error);

        return Response.json(
            { error: "Failed to load attempt history." },
            { status: 500 }
        );
    }
}