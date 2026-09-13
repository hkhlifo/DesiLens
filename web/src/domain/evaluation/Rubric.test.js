import { describe, expect, it } from "vitest";
import {
    DEFAULT_RUBRIC,
    validateRubric,
} from "./Rubric";

describe("Rubric", () => {
    it("contains the expected eight criteria", () => {
        expect(DEFAULT_RUBRIC).toHaveLength(8);
    });

    it("has weights that total 100", () => {
        expect(validateRubric(DEFAULT_RUBRIC)).toBe(true);
    });

    it("rejects a rubric whose weights do not total 100", () => {
        const invalidRubric = [
            { criterion: "Requirement Understanding", weight: 50 },
            { criterion: "Class Responsibilities", weight: 20 },
        ];

        expect(() => validateRubric(invalidRubric)).toThrow(
            "Rubric must total 100"
        );
    });
});