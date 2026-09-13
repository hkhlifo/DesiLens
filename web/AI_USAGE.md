# DesignLens — AI Usage

AI tools were used during the development of DesignLens as an engineering assistant.

The goal was not to delegate the complete design to AI, but to use AI for research, brainstorming, implementation support and reviewing design decisions.

---

## 1. Product Differentiation

### Decision

Use a "Change Test" as part of the learner review flow.

### What AI suggested

AI-assisted brainstorming suggested that simply providing LLD problems, UML diagrams or an AI score would not be a strong differentiator because similar features already exist in LLD practice products.

It suggested focusing on how a learner's design behaves when a requirement changes.

### What I accepted

I accepted the idea of testing a learner's design against a realistic requirement change.

For example:

> Parking prices now depend on vehicle type, parking duration and peak/off-peak hours.

The learner explains which responsibilities and classes would be affected.

### Why

This tests whether the learner has designed around responsibilities and changeable business rules instead of only memorizing design patterns.

---

## 2. Evidence-Based Feedback

### Decision

Structure feedback as:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
````

### What AI suggested

AI suggested avoiding generic feedback such as:

> "Your design has poor cohesion."

Instead, feedback should point to evidence from the learner's submission.

### What I accepted

The evaluator stores evidence together with the concern and suggested improvement.

Example:

```text
Evidence:
ParkingLot handles allocation, payment and pricing.

Concern:
The class may have multiple independent reasons to change.

Suggestion:
Consider separating pricing and payment if these rules are expected to evolve independently.
```

### Why

A learner can act on specific evidence more easily than on a generic score or principle.

---

## 3. Hybrid Evaluation

### Decision

Use both deterministic checks and AI-based reasoning.

### What AI suggested

AI-assisted design discussion identified that some evaluation tasks are better handled using normal application rules while subjective design reasoning can benefit from an LLM.

### What I accepted

The system separates evaluation into:

```text
Deterministic checks
+
AI reasoning
```

Deterministic checks handle things such as:

* Required submission sections
* Rubric validity
* Score limits
* Score totals
* Attempt state transitions
* Persistence

AI can reason about:

* Responsibilities
* Coupling and cohesion
* Abstractions
* Extensibility
* Trade-offs
* Edge cases

### Why

Using an LLM for everything would make the system less predictable.

Using only deterministic rules would not be sufficient for subjective LLD reasoning.

The hybrid approach provides a better balance.

---

## 4. Replaceable Evaluator

### Decision

Create an evaluator abstraction instead of coupling the application directly to one AI provider.

### What AI suggested

AI-assisted architecture discussions suggested separating the evaluation capability from the practice flow.

### What I accepted

The project contains:

```text
Evaluator
   |
   +-- DemoEvaluator
   |
   +-- AIEvaluator
```

The design also allows future implementations such as:

```text
RuleBasedEvaluator
HumanEvaluator
```

### Why

The assignment asks how the system would accommodate another evaluator later.

With this design, the practice flow does not need to be rewritten when a different evaluation mechanism is introduced.

---

## 5. AI Reliability and Fallback

### Decision

Use `DemoEvaluator` as a fallback when AI is unavailable or fails.

### What AI suggested

AI-assisted engineering discussion identified external AI APIs as an unreliable dependency because they can fail due to:

* Network problems
* API errors
* Invalid responses
* Missing API credentials
* Rate limits

### What I accepted

The application attempts to use `AIEvaluator` when an xAI API key is configured.

If AI evaluation fails, the application falls back to `DemoEvaluator`.

The DemoEvaluator follows the same feedback structure and provides deterministic criterion-level feedback.

### Why

The learner should still be able to complete the practice journey even when an external AI service is unavailable.

This also makes the MVP demonstrable without requiring a paid AI API.

---

## 6. AI Output Validation

### Decision

Validate AI-generated evaluation data before storing it.

### What AI suggested

AI-generated structured output should be treated as external/untrusted input rather than being inserted directly into the database.

### What I accepted

The AIEvaluator validates:

* JSON structure
* Number of rubric criteria
* Criterion names
* Maximum scores
* Individual score ranges
* Overall score
* Sum of criterion scores
* Confidence range

For example:

```text
Criterion scores:
15 + 17 + 12 + 13 + 8 + 8 + 9 + 5

Overall:
87
```

The response is rejected if these values are inconsistent.

### Why

An LLM can return malformed or inconsistent output.

Validation keeps invalid evaluation data from entering the application.

---

## 7. What AI Was Not Used For

AI was not used as an unquestioned source of truth.

Important engineering decisions were reviewed against:

* The assignment requirements
* The application's actual behavior
* Tests
* Build results
* Database behavior
* Practical MVP constraints

The final implementation intentionally avoids unnecessary complexity such as:

* Microservices
* Kubernetes
* Message brokers
* Complex authentication
* Large analytics systems

The focus remained on delivering the required learner journey with a clear domain model.

---

## 8. Summary

AI was primarily used as an engineering assistant for:

* Product brainstorming
* Architecture discussions
* Code implementation support
* Debugging
* Research
* Reviewing trade-offs
* Improving documentation

The final system deliberately keeps important decisions explicit and testable.

The guiding principle was:

> Use AI to improve the design process, not to replace engineering judgment.

---
