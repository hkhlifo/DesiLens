export class Feedback {
  constructor({
    criterion,
    score,
    maxScore,
    evidence,
    concern,
    suggestion,
    confidence,
  }) {
    if (!criterion) {
      throw new Error("Feedback criterion is required");
    }

    this.criterion = criterion;
    this.score = score;
    this.maxScore = maxScore;
    this.evidence = evidence;
    this.concern = concern;
    this.suggestion = suggestion;
    this.confidence = confidence;
  }
}