# DesignLens — Research Note

## 1. Problem Context

Low-Level Design (LLD) interviews and learning exercises usually ask candidates to take a set of requirements and turn them into a maintainable object-oriented design.

The difficult part is not simply drawing classes.

A learner needs to reason about:

- What the actual requirements are
- Which objects should exist
- What responsibility belongs to each class
- How classes communicate
- Where business rules should live
- How the design handles change
- How easy the design is to test and extend

This makes LLD practice different from a normal programming exercise.

There may be several valid designs for the same problem.

Therefore, a useful practice platform should focus on the quality of the learner's reasoning rather than comparing the answer against one predefined architecture.

---

## 2. Existing Solutions

Research into existing LLD practice products showed several common approaches.

### LLDCanvas

LLDCanvas provides an interactive environment for practicing LLD problems.

It includes features such as:

- LLD problem sets
- UML/class diagram creation
- Design pattern support
- Code execution
- Interview-style practice
- Analytics
- Community-oriented features

Reference:

https://www.lldcanvas.in/

### LLD Arena

LLD Arena provides a more implementation-oriented approach.

Its features include:

- LLD problems
- Code editor
- Local compilation
- Hidden tests
- Rubrics
- UML support
- Optional AI grading
- Ranking

Reference:

https://github.com/mightbeanshuu/lld-arena

### Archtin

Archtin approaches LLD as an AI-assisted interview experience.

It focuses on:

- AI interviewer interactions
- Trade-off questions
- Pattern detection
- Version-aware submissions
- Readiness evaluation

Reference:

https://archtin.com/

### Hello Interview

Hello Interview provides guided LLD practice around common interview problems.

Examples include:

- Elevator
- Parking Lot
- File System
- Rate Limiter

The experience is more structured and guided than a completely open-ended design exercise.

Reference:

https://www.hellointerview.com/practice/low-level-design

### LowLevelDesignMastery

LowLevelDesignMastery provides an interactive practice environment involving:

- Requirements
- UML
- Implementation
- AI review
- Multiple LLD problems

Reference:

https://www.lowleveldesignmastery.com/playground/

---

## 3. Observations From the Research

Several patterns appear across existing solutions.

### Observation 1 — Practice problems are already common

Parking Lot, Elevator, Vending Machine, File System and similar problems are widely used.

Therefore, simply providing another list of LLD problems is not a strong differentiator.

DesignLens instead focuses on what happens after the learner starts designing.

---

### Observation 2 — UML and code are useful, but they are not enough

Visual diagrams and executable code can help learners practice.

However, they do not automatically explain why a design decision is good or bad.

For example:

```text
ParkingLot
    |
    +-- Payment
    +-- ParkingSpot
    +-- Vehicle
````

The diagram alone does not tell the learner whether `ParkingLot` has too many responsibilities.

A review needs to explain the reasoning behind the concern.

---

### Observation 3 — A single AI score is not enough

An LLM can produce a score such as:

```text
82/100
```

But the score alone gives limited learning value.

A learner needs to understand:

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
```

This makes feedback actionable instead of simply ranking the submission.

---

### Observation 4 — Multiple solutions can be valid

LLD does not always have one objectively correct class structure.

For example, a learner could model pricing using:

```text
PricingService
```

while another learner could use:

```text
PricingStrategy
```

Both could be reasonable depending on the requirements and trade-offs.

Therefore, evaluation should ask:

> "Does this design satisfy the requirements and make sensible trade-offs?"

rather than:

> "Does this design match our reference solution?"

---

## 4. Product Opportunity

Based on these observations, DesignLens focuses on the design-review part of the learning loop.

The proposed experience is:

```text
Choose Problem
      ↓
Design
      ↓
Submit
      ↓
Review
      ↓
Change Test
      ↓
Try Again
```

The important difference is that the platform treats the submission as something to be reviewed rather than simply graded.

---

## 5. Differentiating Idea — The Change Test

The main product idea is the Change Test.

A learner first creates a design for a problem.

Then the platform introduces a realistic requirement change.

For example:

> Parking prices now depend on vehicle type, parking duration and peak/off-peak hours.

The learner must explain how the current design would respond.

Questions can include:

1. Which responsibility is affected?
2. Which class should change?
3. Which existing classes should remain unchanged?
4. What abstraction could isolate the variation?
5. How would the design support another pricing rule later?

This tests whether the learner has designed around responsibilities and likely variation points.

It also discourages blindly adding design patterns.

---

## 6. Feedback Model

The research suggests that feedback should be specific and connected to the learner's actual work.

DesignLens therefore uses:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
```

Example:

### Criterion

Class Responsibilities

### Evidence

The learner's submission states that `ParkingLot` manages parking allocation, payment and pricing.

### Concern

The class may have several independent reasons to change.

### Suggestion

Consider separating pricing and payment responsibilities if those rules are expected to evolve independently.

### Confidence

High

This approach is more useful to a learner than:

> "Use SOLID principles."

---

## 7. Evaluation Approach

The evaluation problem is split into two categories.

### Deterministic checks

These are suitable for normal application logic.

Examples:

- Required sections are present
- Submission is complete
- Rubric totals 100
- Scores are within limits
- All criteria receive feedback
- Attempt transitions are valid
- Database persistence succeeds

These checks should not depend on an LLM.

### Reasoning-based checks

These benefit from AI assistance.

Examples:

- Whether responsibilities are well separated
- Whether coupling is unnecessarily high
- Whether abstractions are useful
- Whether the design is extensible
- Whether trade-offs are reasonable
- Whether edge cases are adequately considered

This leads to a hybrid evaluation model.

---

## 8. Why AI Is Optional

AI can improve the quality of design feedback, but depending completely on an external model introduces reliability concerns.

Possible failures include:

- API unavailable
- Invalid model response
- Invalid JSON
- Rate limits
- Network failures
- Unexpected output

Therefore, DesignLens includes a deterministic fallback evaluator.

The learner can still complete the practice flow when AI is unavailable.

The AI evaluator is an enhancement rather than a single point of failure.

---

## 9. Design Principles Derived From the Research

The research led to the following product principles.

### Principle 1 — Review reasoning, not just output

The learner should understand why a design decision works or does not work.

### Principle 2 — Evidence before criticism

Feedback should refer to something in the learner's actual submission.

### Principle 3 — Avoid pattern worship

A design pattern should only be recommended when it solves an actual design problem.

### Principle 4 — Test changeability

A good LLD should be able to accommodate reasonable requirement changes without unnecessary modifications.

### Principle 5 — Keep the evaluation replaceable

Different evaluators may be useful in different situations.

### Principle 6 — Reliability over unnecessary infrastructure

The MVP should provide a complete learner experience without requiring microservices, queues or complex distributed infrastructure.

---

## 10. MVP Scope

The research supports a focused MVP rather than a large feature set.

The MVP includes:

- A small set of LLD problems
- Text-based design submission
- Structured evaluation
- Evidence-based feedback
- Attempt history
- Change Test
- AI-assisted evaluation when available
- Deterministic fallback evaluation
- Automated tests

The platform deliberately avoids adding large secondary features such as:

- Social feeds
- Leaderboards
- Real-time collaboration
- Complex UML editors
- Payments
- Large analytics dashboards

The objective is to make the core practice loop useful first.

---

## 11. Key Research Conclusion

Existing LLD practice platforms demonstrate that there is value in interactive problems, UML, code execution and AI assistance.

However, the central learning challenge remains:

> How does a learner understand whether their design is actually good and how it will behave when requirements change?

DesignLens addresses this through evidence-based design review and the Change Test.

The product therefore focuses on:

```text
Practice
   ↓
Understand
   ↓
Defend
   ↓
Improve
```

rather than simply:

```text
Practice
   ↓
Score
```

---
