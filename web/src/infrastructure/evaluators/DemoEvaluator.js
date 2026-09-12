import { Evaluator } from "../../domain/evaluator/Evaluator.js";
import { Feedback } from "../../domain/evaluation/Feedback.js";
import { Evaluation } from "../../domain/evaluation/Evaluation.js";
import { DEFAULT_RUBRIC } from "../../domain/evaluation/Rubric.js";

export class DemoEvaluator extends Evaluator {
  async evaluate({ attemptId, submission }) {
    const feedback = DEFAULT_RUBRIC.map((criterion) => {
      const hasContent =
        submission.requirements &&
        submission.classes &&
        submission.relationships &&
        submission.designDecisions &&
        submission.edgeCases;

      const score = hasContent
        ? criterion.weight
        : Math.round(criterion.weight * 0.5);

      return new Feedback({
        criterion: criterion.criterion,
        score,
        maxScore: criterion.weight,
        evidence: hasContent
          ? "The submission provides the required design information."
          : "Some required sections of the design are incomplete.",
        concern: hasContent
          ? "No major issue detected by the demo evaluator."
          : "The incomplete submission limits meaningful evaluation.",
        suggestion: hasContent
          ? "Consider strengthening the design with concrete trade-offs and edge cases."
          : "Complete all design sections before submitting.",
        confidence: 0.5,
      });
    });

    const overallScore = feedback.reduce(
      (total, item) => total + item.score,
      0
    );

    const evaluation = new Evaluation({
      id: crypto.randomUUID(),
      attemptId,
      overallScore,
      summary:
        "This is a demonstration evaluation. AI evaluation will provide deeper design reasoning.",
      feedback,
      strengths: [
        "Submission contains the expected design sections.",
      ],
      priorityImprovements: [
        "Explain why responsibilities are separated this way.",
        "Consider how the design changes when requirements evolve.",
      ],
    });

    evaluation.complete();

    return evaluation;
  }
}