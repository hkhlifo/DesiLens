import { describe, expect, it } from "vitest";
import { Submission } from "./Submission";

function createSubmission(overrides = {}) {
    return new Submission({
        id: "submission-1",
        attemptId: "attempt-1",
        requirements: "Parking lot requirements",
        classes: "ParkingLot, Vehicle, ParkingSpot",
        relationships: "ParkingLot contains ParkingSpot",
        designDecisions: "Use PricingStrategy",
        edgeCases: "Lot full, invalid vehicle",
        ...overrides,
    });
}

describe("Submission", () => {
    it("accepts a complete submission", () => {
        const submission = createSubmission();

        expect(submission.isComplete()).toBe(true);
    });

    it("rejects an incomplete submission", () => {
        const submission = createSubmission({
            classes: "",
        });

        expect(submission.isComplete()).toBe(false);
    });

    it("trims whitespace from submission fields", () => {
        const submission = createSubmission({
            requirements: "  Requirements  ",
            classes: "  Classes  ",
        });

        expect(submission.requirements).toBe("Requirements");
        expect(submission.classes).toBe("Classes");
    });

    it("requires an id", () => {
        expect(
            () =>
                new Submission({
                    attemptId: "attempt-1",
                })
        ).toThrow("Submission id is required");
    });

    it("requires an attempt id", () => {
        expect(
            () =>
                new Submission({
                    id: "submission-1",
                })
        ).toThrow("Attempt id is required");
    });
});