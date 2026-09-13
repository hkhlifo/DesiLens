import { Evaluator } from "../../domain/evaluator/Evaluator";
import { Feedback } from "../../domain/evaluation/Feedback";
import { Evaluation } from "../../domain/evaluation/Evaluation";
import { DEFAULT_RUBRIC } from "../../domain/evaluation/Rubric";

export class AIEvaluator extends Evaluator {
    async evaluate({ attemptId, problem, submission }) {
        const apiKey = process.env.XAI_API_KEY;

        if (!apiKey) {
            throw new Error("XAI_API_KEY is not configured.");
        }

        const prompt = buildPrompt(problem, submission);

        const response = await fetch(
            "https://api.x.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "grok-4-1-fast-reasoning",
                    temperature: 0.2,
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a senior software engineer reviewing Low-Level Design solutions. Evaluate the learner's design fairly. Multiple designs can be valid. Do not assume one reference architecture is the only correct answer.",
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `xAI evaluation failed: ${response.status} ${errorText}`
            );
        }

        const data = await response.json();

        const content =
            data?.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("xAI returned an empty evaluation.");
        }

        const result = parseEvaluation(content);

        return buildEvaluation({
            attemptId,
            result,
        });
    }
}

function buildPrompt(problem, submission) {
    const rubric = DEFAULT_RUBRIC
        .map(
            (item) =>
                `- ${item.criterion}: ${item.weight} points`
        )
        .join("\n");

    return `
Review this Low-Level Design submission.

PROBLEM
Title: ${problem.title}

Description:
${problem.description}

Requirements:
${problem.requirements
            .map((requirement) => `- ${requirement}`)
            .join("\n")}

RUBRIC
${rubric}

LEARNER SUBMISSION

Requirements & Assumptions:
${submission.requirements}

Classes & Responsibilities:
${submission.classes}

Relationships:
${submission.relationships}

Design Decisions:
${submission.designDecisions}

Edge Cases:
${submission.edgeCases}

IMPORTANT EVALUATION RULES

1. Multiple LLD solutions can be valid.
2. Evaluate the learner's reasoning, not whether it matches a reference solution.
3. Every concern should be supported by evidence from the learner's submission.
4. Do not recommend design patterns unless they solve a real variation or design problem.
5. Consider cohesion, coupling, encapsulation, extensibility and testability.
6. Give practical suggestions that a learner can act on.
7. Be fair to simple designs when they satisfy the requirements.
8. Confidence should represent how strongly the evidence supports the assessment.
9. Return ONLY valid JSON.
10. Do not wrap the JSON in markdown code fences.

Return exactly this structure:

{
  "overallScore": 0,
  "summary": "string",
  "strengths": ["string"],
  "priorityImprovements": ["string"],
  "feedback": [
    {
      "criterion": "Requirement Understanding",
      "score": 0,
      "maxScore": 15,
      "evidence": "Exact or closely referenced evidence from the submission.",
      "concern": "string",
      "suggestion": "string",
      "confidence": 0.0
    }
  ]
}

Include exactly one feedback object for every rubric criterion.
Scores must respect the maximum score for each criterion.
The overall score must equal the sum of all criterion scores.
Confidence must be between 0 and 1.
`;
}

function parseEvaluation(content) {
    let parsed;

    try {
        parsed = JSON.parse(content);
    } catch {
        throw new Error(
            "xAI returned invalid JSON."
        );
    }

    validateEvaluation(parsed);

    return parsed;
}

function validateEvaluation(result) {
    if (
        !result ||
        typeof result.overallScore !== "number" ||
        !Array.isArray(result.feedback)
    ) {
        throw new Error(
            "xAI returned an invalid evaluation structure."
        );
    }

    if (
        result.feedback.length !==
        DEFAULT_RUBRIC.length
    ) {
        throw new Error(
            "xAI evaluation does not contain all rubric criteria."
        );
    }

    const expectedTotal = DEFAULT_RUBRIC.reduce(
        (total, item) => total + item.weight,
        0
    );

    const actualTotal = result.feedback.reduce(
        (total, item) => total + item.score,
        0
    );

    if (actualTotal !== result.overallScore) {
        throw new Error(
            "xAI evaluation score does not match feedback scores."
        );
    }

    if (result.overallScore < 0 || result.overallScore > expectedTotal) {
        throw new Error(
            "xAI evaluation score is outside the valid range."
        );
    }

    for (const rubricItem of DEFAULT_RUBRIC) {
        const feedback = result.feedback.find(
            (item) =>
                item.criterion === rubricItem.criterion
        );

        if (!feedback) {
            throw new Error(
                `Missing rubric criterion: ${rubricItem.criterion}`
            );
        }

        if (
            feedback.maxScore !== rubricItem.weight ||
            feedback.score < 0 ||
            feedback.score > rubricItem.weight
        ) {
            throw new Error(
                `Invalid score for ${rubricItem.criterion}`
            );
        }

        if (
            typeof feedback.confidence !== "number" ||
            feedback.confidence < 0 ||
            feedback.confidence > 1
        ) {
            throw new Error(
                `Invalid confidence for ${rubricItem.criterion}`
            );
        }
    }
}

function buildEvaluation({ attemptId, result }) {
    const feedback = result.feedback.map(
        (item) =>
            new Feedback({
                criterion: item.criterion,
                score: item.score,
                maxScore: item.maxScore,
                evidence: item.evidence,
                concern: item.concern,
                suggestion: item.suggestion,
                confidence: item.confidence,
            })
    );

    const evaluation = new Evaluation({
        id: crypto.randomUUID(),
        attemptId,
        overallScore: result.overallScore,
        summary: result.summary,
        feedback,
        strengths: result.strengths || [],
        priorityImprovements:
            result.priorityImprovements || [],
    });

    evaluation.complete();

    return evaluation;
}