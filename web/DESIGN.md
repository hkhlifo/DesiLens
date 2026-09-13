# DesignLens — Design Note

## 1. Overview

DesignLens is a focused Low-Level Design practice platform.

The main learner journey is:

> Choose problem → Think/design → Submit → Get feedback → Review → Try again

The goal is not to decide whether a learner's design is "correct" or whether it matches one reference solution.

Instead, DesignLens reviews the learner's design using a consistent rubric and provides evidence-based feedback.

---

## 2. Core Product Idea

The platform treats an LLD submission as a design that can be reviewed from multiple perspectives.

The evaluation focuses on four main lenses:

### Intent

Does the learner understand the requirements?

The review considers:

- Requirements captured
- Assumptions
- Scope
- Missing important constraints

### Structure

How are responsibilities divided?

The review considers:

- Class responsibilities
- Coupling
- Cohesion
- Encapsulation
- Interfaces
- Abstractions

### Change

How easily can the design handle a requirement change?

DesignLens uses a "Change Test" where the learner is given a new variation and explains:

- Which responsibility is affected
- Which classes need modification
- Which parts should remain unchanged
- What abstraction could isolate the change

### Evidence

Feedback should be connected to the learner's actual submission.

Instead of saying:

> "Your design has poor cohesion."

DesignLens should provide:

> Evidence: "ParkingLot handles allocation, payment and pricing."

Then explain the concern and suggest a possible improvement.

---

## 3. Domain Model

The core domain contains the following concepts:

```text
Problem
   |
   v
Attempt
   |
   v
Submission
   |
   v
Evaluation
   |
   v
Feedback
````

### Problem

Represents an LLD problem available for practice.

Important information includes:

- id
- title
- description
- difficulty
- requirements

A problem does not contain a reference implementation that is treated as the only correct answer.

---

### Attempt

Represents one learner's practice journey for a problem.

An attempt has a lifecycle:

```text
DRAFT
  |
  v
SUBMITTED
  |
  v
EVALUATING
  |
  +----> COMPLETED
  |
  +----> FAILED
```

The domain object controls valid state transitions.

For example:

- A draft cannot be evaluated.
- An attempt cannot be submitted without a submission.
- A completed attempt cannot be submitted again.

This prevents invalid states from being created accidentally.

---

### Submission

A submission represents the learner's actual design.

For the MVP, the submission is text-based and contains:

1. Requirements & Assumptions
2. Classes & Responsibilities
3. Relationships
4. Design Decisions
5. Edge Cases

Submission is kept separate from Attempt because the attempt represents the learner journey while the submission represents the design artifact.

This also makes it easier to support additional submission formats later.

For example:

```text
Attempt
   |
   +-- TextSubmission
   |
   +-- CodeSubmission       (future)
   |
   +-- DiagramSubmission    (future)
```

---

### Evaluation

An evaluation represents the result of reviewing a submission.

It contains:

- overall score
- summary
- strengths
- priority improvements
- criterion-level feedback
- evaluation status

The evaluation is created independently from the learner's submission.

---

### Feedback

Each feedback item belongs to one rubric criterion.

Its structure is:

```text
Criterion
    ↓
Score
    ↓
Evidence
    ↓
Concern
    ↓
Suggestion
    ↓
Confidence
```

This structure makes feedback more actionable than a single overall score.

---

## 4. Evaluation Strategy

DesignLens uses a hybrid evaluation approach.

### Deterministic evaluation

Some things can be checked reliably without an LLM.

Examples:

- Required submission sections exist
- Submission is complete
- Rubric totals 100 points
- Score is within the criterion's maximum
- All rubric criteria are present
- Attempt state transitions are valid
- Data is persisted correctly

These checks should remain deterministic because they do not require subjective reasoning.

---

### AI evaluation

LLMs are useful for reasoning about the quality of a design.

AI can help evaluate:

- Responsibility allocation
- Coupling and cohesion
- Abstraction decisions
- SOLID principles
- Extensibility
- Trade-offs
- Edge cases
- Explanation quality

The AI is instructed that multiple LLD solutions can be valid.

It should evaluate the learner's reasoning rather than compare the submission against one "correct" architecture.

---

### Evaluator abstraction

Evaluation is hidden behind an evaluator abstraction:

```text
Evaluator
   |
   +-- DemoEvaluator
   |
   +-- AIEvaluator
   |
   +-- RuleBasedEvaluator   (future)
   |
   +-- HumanEvaluator       (future)
```

The practice flow does not need to know which evaluator is being used.

This allows another evaluator to be introduced without rewriting the attempt and submission flow.

---

## 5. Why DemoEvaluator Exists

The MVP must remain usable even when an external AI service is unavailable.

Therefore, DesignLens includes a deterministic `DemoEvaluator`.

It provides meaningful criterion-specific feedback using the same evaluation structure as the AI evaluator.

This gives the system a reliable fallback when:

- No AI API key is configured
- The AI service fails
- The AI response is invalid
- The external service is temporarily unavailable

The learner should still receive a review rather than seeing the entire submission flow fail.

---

## 6. AI Response Validation

AI output is treated as untrusted external input.

The AI evaluator therefore validates:

- JSON structure
- Number of feedback criteria
- Criterion names
- Score limits
- Overall score
- Score total
- Confidence range
- Required fields

For example:

```text
Criterion scores:
15 + 17 + 12 + 13 + 8 + 8 + 9 + 5

Overall score:
87
```

If the individual scores do not add up to the reported overall score, the response is rejected.

This prevents malformed AI output from entering the database.

---

## 7. Persistence and Evaluation Flow

Submission data is persisted only after the evaluation has successfully been produced in the current MVP flow.

The persistence operation uses a database transaction so the attempt, submission, evaluation and feedback are stored together.

Conceptually:

```text
Submit
  |
  v
Validate submission
  |
  v
Create domain objects
  |
  v
Evaluate
  |
  +---- AI available
  |       |
  |       v
  |    AIEvaluator
  |
  +---- AI unavailable/fails
          |
          v
       DemoEvaluator
  |
  v
Persist Attempt
  |
  v
Persist Submission
  |
  v
Persist Evaluation
  |
  v
Persist Feedback
```

The transaction prevents a partially saved evaluation from being presented as a completed review.

---

## 8. Database Model

The MVP uses PostgreSQL.

The main relationships are:

```text
Attempt 1 ───── 1 Submission

Attempt 1 ───── 1 Evaluation

Evaluation 1 ───── N Feedback
```

This gives a simple structure while keeping the domain concepts separate.

---

## 9. Extensibility

### New submission format

Today:

```text
TextSubmission
```

Later:

```text
TextSubmission
CodeSubmission
DiagramSubmission
```

The core Attempt concept does not need to change because a submission is already a separate domain concept.

---

### New evaluator

Today:

```text
DemoEvaluator
AIEvaluator
```

Later:

```text
RuleBasedEvaluator
HumanEvaluator
```

The practice flow depends on the evaluator abstraction rather than a specific implementation.

---

### New problem

Problems are represented independently from attempts and evaluators.

Adding a new problem should mainly require:

1. Problem definition
2. Requirements
3. Optional change-test definition

The evaluation architecture remains unchanged.

---

## 10. Handling Slow or Failed Evaluation

Evaluation is an external dependency when AI is enabled.

The attempt therefore has explicit evaluation states:

```text
SUBMITTED
    ↓
EVALUATING
    ↓
COMPLETED
```

or:

```text
EVALUATING
    ↓
FAILED
```

The important design decision is that evaluation status is part of the domain instead of being represented only by a frontend loading state.

For the MVP, the API waits for evaluation and uses the deterministic evaluator as a fallback.

A production version could move evaluation into a background job:

```text
Submit
  ↓
Persist submission
  ↓
EVALUATING
  ↓
Background evaluator
  ↓
COMPLETED / FAILED
```

This would allow retries and prevent a slow AI provider from blocking the request.

A queue or worker is intentionally not introduced in the MVP because it would add infrastructure complexity without being necessary for the core learner journey.

---

## 11. Change Test

The Change Test is designed to evaluate how the learner's design behaves when requirements change.

Example:

> Parking prices now depend on vehicle type, parking duration and peak/off-peak hours.

The learner explains:

- What responsibility changes?
- Which class should handle the change?
- Which existing classes should remain unchanged?
- What abstraction could isolate the variation?
- How would the design support future pricing changes?

This tests design adaptability rather than pattern memorization.

---

## 12. Important Design Trade-offs

### Why not use only an LLM?

An LLM can provide useful reasoning but can also:

- produce inconsistent scores
- misunderstand a submission
- return malformed output
- over-recommend design patterns

Therefore, deterministic validation and a fallback evaluator are used around the AI.

---

### Why not use only deterministic rules?

LLD quality is not completely objective.

Two different class structures can both be reasonable.

Simple rules cannot reliably judge:

- trade-offs
- responsibility boundaries
- abstraction quality
- design reasoning

Therefore, AI is useful for the subjective part.

---

### Why not build microservices?

The assignment is focused on LLD and domain design.

A monolithic application is sufficient for the MVP and keeps the architecture easier to understand, test and deploy.

Microservices would add operational complexity without improving the learner journey at this stage.

---

### Why separate Attempt and Submission?

An Attempt represents the learner's journey.

A Submission represents a snapshot of their design.

Keeping them separate makes it possible to support:

- multiple submission versions
- history
- different submission formats
- re-evaluation

without making Attempt responsible for the actual design content.

---

## 13. Architecture

The current application follows a simple layered structure:

```text
Next.js Application
│
├── Presentation
│   ├── Pages
│   └── Components
│
├── API
│   └── Route Handlers
│
├── Domain
│   ├── Problem
│   ├── Attempt
│   ├── Submission
│   ├── Evaluation
│   ├── Feedback
│   ├── Rubric
│   └── Evaluator
│
├── Infrastructure
│   └── Evaluators
│       ├── DemoEvaluator
│       └── AIEvaluator
│
├── Data
│   ├── Problems
│   └── Change Tests
│
└── PostgreSQL
```

The domain layer does not depend on the UI.

This keeps business rules such as attempt state transitions inside domain objects rather than scattering them across React components.

---

## 14. MVP Scope

The MVP intentionally focuses on the complete practice loop.

Included:

- Four LLD problems
- Text-based design submission
- Attempt lifecycle
- PostgreSQL persistence
- Evaluation
- AI evaluator integration
- Deterministic fallback evaluator
- Criterion-level feedback
- Evidence-based feedback
- Attempt history
- Change Test
- Automated tests
- Responsive interface

Not included:

- Authentication
- Social features
- Leaderboards
- Microservices
- Real-time collaboration
- Complex UML editor
- Payment system
- Large-scale analytics

These features can be considered later if the core practice loop proves valuable.

---

## 15. Design Goal

The central design principle is:

> Don't grade the design. Review the design.

The platform should help learners understand **why** a design is strong or weak and what they can improve in their next attempt.

The most important output is therefore not the score.

It is the feedback that helps the learner make a better design decision the next time.

---
