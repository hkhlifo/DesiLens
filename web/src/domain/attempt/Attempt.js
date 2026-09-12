export const ATTEMPT_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  EVALUATING: "EVALUATING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export class Attempt {
  constructor({ id, problemId }) {
    if (!id) {
      throw new Error("Attempt id is required");
    }

    if (!problemId) {
      throw new Error("Problem id is required");
    }

    this.id = id;
    this.problemId = problemId;
    this.status = ATTEMPT_STATUS.DRAFT;
    this.submissionId = null;
    this.evaluationId = null;
    this.createdAt = new Date();
    this.submittedAt = null;
  }

  attachSubmission(submissionId) {
    if (this.status !== ATTEMPT_STATUS.DRAFT) {
      throw new Error("Cannot attach submission after attempt is submitted");
    }

    this.submissionId = submissionId;
  }

  submit() {
    if (!this.submissionId) {
      throw new Error("Cannot submit an attempt without a submission");
    }

    if (this.status !== ATTEMPT_STATUS.DRAFT) {
      throw new Error("Attempt has already been submitted");
    }

    this.status = ATTEMPT_STATUS.SUBMITTED;
    this.submittedAt = new Date();
  }

  startEvaluation() {
    if (this.status !== ATTEMPT_STATUS.SUBMITTED) {
      throw new Error("Only submitted attempts can be evaluated");
    }

    this.status = ATTEMPT_STATUS.EVALUATING;
  }

  completeEvaluation(evaluationId) {
    if (this.status !== ATTEMPT_STATUS.EVALUATING) {
      throw new Error("Attempt is not being evaluated");
    }

    this.evaluationId = evaluationId;
    this.status = ATTEMPT_STATUS.COMPLETED;
  }

  failEvaluation() {
    if (this.status !== ATTEMPT_STATUS.EVALUATING) {
      throw new Error("Attempt is not being evaluated");
    }

    this.status = ATTEMPT_STATUS.FAILED;
  }
}