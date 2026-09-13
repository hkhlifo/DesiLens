import { db } from "../../../../../prisma/db";
import { Attempt } from "../../../../../domain/attempt/Attempt";
import { Submission } from "../../../../../domain/submission/Submission";
import { AIEvaluator } from "../../../../../infrastructure/evaluators/AIEvaluator";
import { DemoEvaluator } from "../../../../../infrastructure/evaluators/DemoEvaluator";
import { getProblemById } from "../../../../../data/problems";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const submissionData = body?.submission;
    const problemId = body?.problemId;

    // --------------------------------------------------
    // 1. Validate request
    // --------------------------------------------------

    if (!submissionData) {
      return Response.json(
        {
          error: "Submission is required.",
        },
        { status: 400 }
      );
    }

    if (!problemId) {
      return Response.json(
        {
          error: "Problem id is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 2. Find the problem
    // --------------------------------------------------

    const problem = getProblemById(problemId);

    if (!problem) {
      return Response.json(
        {
          error: "Problem not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 3. Create domain submission
    // --------------------------------------------------

    const submission = new Submission({
      id: crypto.randomUUID(),
      attemptId: id,
      requirements: submissionData.requirements,
      classes: submissionData.classes,
      relationships: submissionData.relationships,
      designDecisions: submissionData.designDecisions,
      edgeCases: submissionData.edgeCases,
    });

    if (!submission.isComplete()) {
      return Response.json(
        {
          error:
            "All design sections must be completed before submission.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. Create domain attempt
    // --------------------------------------------------

    const attempt = new Attempt({
      id,
      problemId,
    });

    attempt.attachSubmission(submission.id);
    attempt.submit();
    attempt.startEvaluation();

    // --------------------------------------------------
    // 5. Evaluate the design
    // --------------------------------------------------

    let evaluation;
    let evaluatorType = "demo";

    if (process.env.XAI_API_KEY) {
      try {
        const evaluator = new AIEvaluator();

        evaluation = await evaluator.evaluate({
          attemptId: id,
          problem,
          submission,
        });

        evaluatorType = "ai";

        console.log(
          "Evaluation completed using xAI."
        );
      } catch (error) {
        console.error(
          "xAI evaluation failed. Falling back to DemoEvaluator:",
          error
        );

        const evaluator = new DemoEvaluator();

        evaluation = await evaluator.evaluate({
          attemptId: id,
          submission,
        });

        console.log(
          "Evaluation completed using DemoEvaluator fallback."
        );
      }
    } else {
      console.log(
        "XAI_API_KEY is not configured. Using DemoEvaluator."
      );

      const evaluator = new DemoEvaluator();

      evaluation = await evaluator.evaluate({
        attemptId: id,
        submission,
      });
    }

    attempt.completeEvaluation(evaluation.id);

    // --------------------------------------------------
    // 6. Persist everything in one transaction
    // --------------------------------------------------

    await db.transaction(async (tx) => {
      await tx.orm.public.Attempt.create({
        id: attempt.id,
        problemId: attempt.problemId,
        status: attempt.status,
        createdAt: attempt.createdAt,
        submittedAt: attempt.submittedAt,
      });

      await tx.orm.public.Submission.create({
        id: submission.id,
        attemptId: submission.attemptId,
        requirements: submission.requirements,
        classes: submission.classes,
        relationships: submission.relationships,
        designDecisions: submission.designDecisions,
        edgeCases: submission.edgeCases,
        createdAt: submission.createdAt,
      });

      await tx.orm.public.Evaluation.create({
        id: evaluation.id,
        attemptId: evaluation.attemptId,
        status: evaluation.status,
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        createdAt: evaluation.createdAt,
      });

      for (const feedback of evaluation.feedback) {
        await tx.orm.public.Feedback.create({
          id: crypto.randomUUID(),
          evaluationId: evaluation.id,
          criterion: feedback.criterion,
          score: feedback.score,
          maxScore: feedback.maxScore,
          evidence: feedback.evidence,
          concern: feedback.concern,
          suggestion: feedback.suggestion,
          confidence: feedback.confidence,
        });
      }
    });

    // --------------------------------------------------
    // 7. Return result to frontend
    // --------------------------------------------------

    return Response.json({
      success: true,

      evaluator: evaluatorType,

      attempt: {
        id: attempt.id,
        problemId: attempt.problemId,
        status: attempt.status,
        submissionId: attempt.submissionId,
        evaluationId: attempt.evaluationId,
        submittedAt: attempt.submittedAt,
      },

      submission: {
        id: submission.id,
        attemptId: submission.attemptId,
        requirements: submission.requirements,
        classes: submission.classes,
        relationships: submission.relationships,
        designDecisions: submission.designDecisions,
        edgeCases: submission.edgeCases,
        createdAt: submission.createdAt,
      },

      evaluation,
    });
  } catch (error) {
    console.error(
      "Submission evaluation failed:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to evaluate and save the submission.",
      },
      { status: 500 }
    );
  }
}