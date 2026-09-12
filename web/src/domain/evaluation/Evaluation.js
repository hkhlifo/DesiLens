export const EVALUATION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export class Evaluation {
  constructor({
    id,
    attemptId,
    overallScore = 0,
    summary = "",
    feedback = [],
    strengths = [],
    priorityImprovements = [],
  }) {
    if (!id) {
      throw new Error("Evaluation id is required");
    }

    if (!attemptId) {
      throw new Error("Attempt id is required");
    }

    this.id = id;
    this.attemptId = attemptId;
    this.status = EVALUATION_STATUS.PENDING;
    this.overallScore = overallScore;
    this.summary = summary;
    this.feedback = feedback;
    this.strengths = strengths;
    this.priorityImprovements = priorityImprovements;
    this.createdAt = new Date();
  }

  complete() {
    this.status = EVALUATION_STATUS.COMPLETED;
  }

  fail() {
    this.status = EVALUATION_STATUS.FAILED;
  }
}