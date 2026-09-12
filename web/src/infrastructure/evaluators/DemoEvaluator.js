import { Evaluator } from "../../domain/evaluator/Evaluator.js";
import { Feedback } from "../../domain/evaluation/Feedback.js";
import { Evaluation } from "../../domain/evaluation/Evaluation.js";
import { DEFAULT_RUBRIC } from "../../domain/evaluation/Rubric.js";

export class DemoEvaluator extends Evaluator {
  async evaluate({ attemptId, submission }) {
    const feedback = DEFAULT_RUBRIC.map((criterion) =>
      evaluateCriterion(criterion, submission)
    );

    const overallScore = feedback.reduce(
      (total, item) => total + item.score,
      0
    );

    const strengths = feedback
      .filter((item) => item.score >= item.maxScore * 0.8)
      .map((item) => item.criterion);

    const priorityImprovements = feedback
      .filter((item) => item.score < item.maxScore * 0.7)
      .sort(
        (a, b) =>
          b.maxScore -
          b.score -
          (a.maxScore - a.score)
      )
      .slice(0, 3)
      .map((item) => item.suggestion);

    const evaluation = new Evaluation({
      id: crypto.randomUUID(),
      attemptId,
      overallScore,
      summary: buildSummary(overallScore, feedback),
      feedback,
      strengths,
      priorityImprovements,
    });

    evaluation.complete();

    return evaluation;
  }
}

function evaluateCriterion(criterion, submission) {
  switch (criterion.criterion) {
    case "Requirement Understanding":
      return evaluateRequirements(criterion, submission);

    case "Class Responsibilities":
      return evaluateClasses(criterion, submission);

    case "Coupling & Cohesion":
      return evaluateRelationships(criterion, submission);

    case "Encapsulation & Interfaces":
      return evaluateEncapsulation(criterion, submission);

    case "Abstraction / Patterns":
      return evaluateAbstraction(criterion, submission);

    case "Extensibility":
      return evaluateExtensibility(criterion, submission);

    case "Edge Cases & Testability":
      return evaluateEdgeCases(criterion, submission);

    case "Explanation Quality":
      return evaluateExplanation(criterion, submission);

    default:
      return basicFeedback(criterion, submission);
  }
}

function evaluateRequirements(criterion, submission) {
  const text = submission.requirements;

  const hasRequirements =
    text.length > 80;

  const hasAssumptions =
    /assumption|assume|assuming/i.test(text);

  const score = calculateScore(
    criterion.weight,
    hasRequirements,
    hasAssumptions
  );

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasAssumptions
      ? findEvidence(text, /assumption|assume|assuming/i)
      : text.slice(0, 160),
    concern: hasAssumptions
      ? "Requirements and assumptions are both identified."
      : "The requirements are described, but assumptions are not clearly separated.",
    suggestion:
      "State important assumptions explicitly, especially around supported vehicle types, pricing rules, and system boundaries.",
    confidence: 0.78,
  });
}

function evaluateClasses(criterion, submission) {
  const text = submission.classes;

  const classCount =
    (text.match(/\n/g) || []).length + 1;

  const hasResponsibilities =
    /manage|handles|responsible|contains|represent/i.test(text);

  const hasGoodStructure =
    classCount >= 3 && hasResponsibilities;

  const score = hasGoodStructure
    ? criterion.weight
    : hasResponsibilities
      ? Math.round(criterion.weight * 0.75)
      : Math.round(criterion.weight * 0.5);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasResponsibilities
      ? findEvidence(
          text,
          /manage|handles|responsible|contains|represent/i
        )
      : text.slice(0, 160),
    concern: hasGoodStructure
      ? "The classes have identifiable responsibilities."
      : "Some responsibilities may be too broad or are not clearly assigned.",
    suggestion:
      "Give each important class one clear responsibility and avoid putting unrelated business logic into a single manager class.",
    confidence: 0.75,
  });
}

function evaluateRelationships(criterion, submission) {
  const text = submission.relationships;

  const hasRelationships =
    /contains|has|uses|depends|associated|extends|implements|composition|aggregation/i.test(
      text
    );

  const score = hasRelationships
    ? criterion.weight
    : Math.round(criterion.weight * 0.5);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasRelationships
      ? findEvidence(
          text,
          /contains|has|uses|depends|associated|extends|implements|composition|aggregation/i
        )
      : text.slice(0, 160),
    concern: hasRelationships
      ? "The submission explains how the main objects interact."
      : "Relationships between the classes are not very explicit.",
    suggestion:
      "Explain important dependencies and ownership relationships. Mention where composition, association, or interfaces are used.",
    confidence: 0.72,
  });
}

function evaluateEncapsulation(criterion, submission) {
  const combined =
    `${submission.classes} ${submission.relationships} ${submission.designDecisions}`;

  const hasInterface =
    /interface|private|encapsulat|public method|getter|setter/i.test(
      combined
    );

  const score = hasInterface
    ? criterion.weight
    : Math.round(criterion.weight * 0.6);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasInterface
      ? findEvidence(
          combined,
          /interface|private|encapsulat|public method|getter|setter/i
        )
      : "No explicit interface or encapsulation decision was found.",
    concern: hasInterface
      ? "The design considers how responsibilities are exposed."
      : "The submission does not clearly explain what should be hidden behind class boundaries.",
    suggestion:
      "Identify the public operations of important classes and keep internal state changes behind those boundaries.",
    confidence: 0.7,
  });
}

function evaluateAbstraction(criterion, submission) {
  const text = submission.designDecisions;

  const hasAbstraction =
    /strategy|factory|observer|state|interface|abstraction|polymorphism/i.test(
      text
    );

  const score = hasAbstraction
    ? criterion.weight
    : Math.round(criterion.weight * 0.65);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasAbstraction
      ? findEvidence(
          text,
          /strategy|factory|observer|state|interface|abstraction|polymorphism/i
        )
      : text.slice(0, 160),
    concern: hasAbstraction
      ? "The design identifies an abstraction where future variation may occur."
      : "No explicit abstraction is described.",
    suggestion:
      "Do not add patterns only for their own sake. Introduce an abstraction where a requirement is likely to vary, such as pricing or allocation strategy.",
    confidence: 0.8,
  });
}

function evaluateExtensibility(criterion, submission) {
  const combined =
    `${submission.designDecisions} ${submission.classes} ${submission.edgeCases}`;

  const hasChangeThinking =
    /extend|new|change|future|easily|without modifying|strategy|replace/i.test(
      combined
    );

  const score = hasChangeThinking
    ? criterion.weight
    : Math.round(criterion.weight * 0.55);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasChangeThinking
      ? findEvidence(
          combined,
          /extend|new|change|future|easily|without modifying|strategy|replace/i
        )
      : "The submission does not clearly discuss how the design would evolve.",
    concern: hasChangeThinking
      ? "The design considers at least one likely future change."
      : "The impact of future requirement changes is not discussed.",
    suggestion:
      "Test the design against a requirement change. For example, ask what happens if parking fees vary by vehicle type or time.",
    confidence: 0.77,
  });
}

function evaluateEdgeCases(criterion, submission) {
  const text = submission.edgeCases;

  const lines =
    text.split("\n").filter((line) => line.trim()).length;

  const hasFailures =
    /fail|invalid|unavailable|empty|duplicate|error|no |not available|insufficient/i.test(
      text
    );

  const score =
    lines >= 3 && hasFailures
      ? criterion.weight
      : hasFailures
        ? Math.round(criterion.weight * 0.75)
        : Math.round(criterion.weight * 0.5);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasFailures
      ? findEvidence(
          text,
          /fail|invalid|unavailable|empty|duplicate|error|no |not available|insufficient/i
        )
      : text.slice(0, 160),
    concern:
      lines >= 3
        ? "Multiple failure and boundary cases are considered."
        : "The design could explore more failure and boundary cases.",
    suggestion:
      "Consider unavailable resources, invalid input, failed operations, duplicate requests, and repeated operations.",
    confidence: 0.8,
  });
}

function evaluateExplanation(criterion, submission) {
  const text =
    `${submission.requirements} ${submission.classes} ${submission.relationships} ${submission.designDecisions} ${submission.edgeCases}`;

  const hasReasoning =
    /because|trade-off|tradeoff|reason|instead|why|alternative/i.test(
      text
    );

  const score = hasReasoning
    ? criterion.weight
    : Math.round(criterion.weight * 0.6);

  return new Feedback({
    criterion: criterion.criterion,
    score,
    maxScore: criterion.weight,
    evidence: hasReasoning
      ? findEvidence(
          text,
          /because|trade-off|tradeoff|reason|instead|why|alternative/i
        )
      : "The submission mainly describes the design without explaining many trade-offs.",
    concern: hasReasoning
      ? "The submission gives reasoning behind at least one design decision."
      : "More explanation of why particular design decisions were chosen would make the review stronger.",
    suggestion:
      "For important decisions, explain why you chose the approach and what trade-off it introduces.",
    confidence: 0.76,
  });
}

function basicFeedback(criterion, submission) {
  const hasContent =
    Object.values(submission).some(
      (value) => value && value.trim()
    );

  return new Feedback({
    criterion: criterion.criterion,
    score: hasContent
      ? Math.round(criterion.weight * 0.7)
      : Math.round(criterion.weight * 0.4),
    maxScore: criterion.weight,
    evidence: "Submission content was provided for review.",
    concern: "The design could be explored in more depth.",
    suggestion: "Explain the reasoning behind the design more clearly.",
    confidence: 0.5,
  });
}

function calculateScore(weight, primary, secondary) {
  if (primary && secondary) return weight;
  if (primary) return Math.round(weight * 0.75);
  return Math.round(weight * 0.5);
}

function findEvidence(text, regex) {
  const match = text.match(regex);

  if (!match) {
    return text.slice(0, 160);
  }

  const index = match.index;

  return text
    .slice(Math.max(0, index - 50), index + 150)
    .trim();
}

function buildSummary(score, feedback) {
  const strong = feedback.filter(
    (item) => item.score >= item.maxScore * 0.8
  ).length;

  const weak = feedback.filter(
    (item) => item.score < item.maxScore * 0.7
  ).length;

  if (score >= 85) {
    return `Strong design foundation. ${strong} areas show clear reasoning. Focus on testing the design against requirement changes.`;
  }

  if (score >= 70) {
    return `Good starting design with ${strong} strong areas. ${weak} areas need deeper reasoning or clearer boundaries.`;
  }

  return `The core design is taking shape, but ${weak} areas need more attention. Focus on responsibilities, boundaries, and design trade-offs.`;
}