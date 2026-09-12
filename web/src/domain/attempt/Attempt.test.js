import { describe, expect, it } from "vitest";
import {
  Attempt,
  ATTEMPT_STATUS,
} from "./Attempt.js";

describe("Attempt", () => {
  it("starts as a draft", () => {
    const attempt = new Attempt({
      id: "attempt-1",
      problemId: "parking-lot",
    });

    expect(attempt.status).toBe(ATTEMPT_STATUS.DRAFT);
  });

  it("cannot submit without a submission", () => {
    const attempt = new Attempt({
      id: "attempt-1",
      problemId: "parking-lot",
    });

    expect(() => attempt.submit()).toThrow(
      "Cannot submit an attempt without a submission"
    );
  });

  it("follows the correct evaluation lifecycle", () => {
    const attempt = new Attempt({
      id: "attempt-1",
      problemId: "parking-lot",
    });

    attempt.attachSubmission("submission-1");
    attempt.submit();

    expect(attempt.status).toBe(ATTEMPT_STATUS.SUBMITTED);

    attempt.startEvaluation();

    expect(attempt.status).toBe(ATTEMPT_STATUS.EVALUATING);

    attempt.completeEvaluation("evaluation-1");

    expect(attempt.status).toBe(ATTEMPT_STATUS.COMPLETED);
  });

  it("can move to failed when evaluation fails", () => {
    const attempt = new Attempt({
      id: "attempt-1",
      problemId: "parking-lot",
    });

    attempt.attachSubmission("submission-1");
    attempt.submit();
    attempt.startEvaluation();
    attempt.failEvaluation();

    expect(attempt.status).toBe(ATTEMPT_STATUS.FAILED);
  });
});