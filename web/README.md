# DesignLens

### Practice LLD. Understand your design.

DesignLens is a focused Low-Level Design practice platform where learners design solutions, submit them for review, understand the reasoning behind the feedback, and test how their design responds to changing requirements.

> **Don't grade the design. Review the design.**

---

## Why DesignLens?

LLD problems rarely have only one correct design.

A learner can solve the same problem using different classes, abstractions and patterns while still producing a good solution.

Because of this, DesignLens focuses on:

- Requirement understanding
- Class responsibilities
- Coupling and cohesion
- Encapsulation and interfaces
- Abstraction
- Extensibility
- Edge cases and testability
- Quality of explanation

Feedback is connected to evidence from the learner's actual submission instead of providing only a final score.

---

## Core Learning Loop

```text
Choose Problem
      ↓
Think & Design
      ↓
Submit
      ↓
Get Review
      ↓
Change Test
      ↓
Try Again
````

The goal is to help the learner improve their design reasoning over multiple attempts.

---

## Key Features

### LLD Problems

The MVP includes four focused problems:

* Parking Lot
* Elevator System
* Vending Machine
* Library Management

Each problem contains requirements that the learner must reason about before designing.

---

### Structured Design Submission

Learners submit their design using five sections:

1. Requirements & Assumptions
2. Classes & Responsibilities
3. Relationships
4. Design Decisions
5. Edge Cases

This provides enough structure to make the submission meaningful while keeping the MVP simple.

---

### Evidence-Based Review

Each rubric criterion produces structured feedback:

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

Example:

```text
Criterion:
Class Responsibilities

Evidence:
ParkingLot handles allocation, payment and pricing.

Concern:
The class may have multiple independent reasons to change.

Suggestion:
Consider separating pricing and payment if these rules
are expected to evolve independently.
```

---

### Change Test

After submitting a design, the learner can test it against a new requirement.

For example:

> Parking prices now depend on vehicle type, duration and peak/off-peak hours.

The learner explains:

* What responsibility is affected?
* Which class should change?
* What should remain unchanged?
* What abstraction could isolate the change?
* How would the design support future changes?

This focuses on design adaptability rather than memorizing patterns.

---

### Attempt History

Previous attempts are stored in PostgreSQL.

Learners can return to previous reviews and compare their design decisions over time.

---

### AI-Assisted Evaluation

When an xAI API key is configured, DesignLens can use an AI evaluator to reason about the quality of the design.

The AI is explicitly instructed that:

* Multiple solutions can be valid.
* A reference solution should not be treated as the only correct answer.
* Feedback should use evidence from the learner's submission.
* Patterns should not be recommended without a real reason.
* Suggestions should be practical.

AI output is validated before it is stored.

---

### Reliable Fallback Evaluation

AI is an optional dependency.

When the AI service is unavailable or returns an invalid response, DesignLens falls back to `DemoEvaluator`.

This means the core learner journey can still be demonstrated without an AI API.

---

# Architecture

DesignLens is intentionally implemented as a monolith.

```text
Next.js
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

---

## Domain Model

```text
Problem
   │
   ▼
Attempt
   │
   ├──────────────► Submission
   │
   ▼
Evaluation
   │
   ▼
Feedback
```

### Attempt Lifecycle

```text
DRAFT
  │
  ▼
SUBMITTED
  │
  ▼
EVALUATING
  │
  ├──────► COMPLETED
  │
  └──────► FAILED
```

The lifecycle is controlled by the domain model rather than only by frontend state.

---

## Evaluator Design

Evaluation is replaceable through an evaluator abstraction.

```text
Evaluator
   │
   ├── DemoEvaluator
   │
   └── AIEvaluator
```

Future evaluators could include:

```text
RuleBasedEvaluator
HumanEvaluator
```

The practice flow does not need to be rewritten when another evaluator is introduced.

---

## Submission Extensibility

The MVP currently supports text submissions.

The design allows additional formats later:

```text
Submission
   │
   ├── TextSubmission
   ├── CodeSubmission
   └── DiagramSubmission
```

The core Attempt concept does not need to know the details of each format.

---

# Tech Stack

### Frontend / Application

* Next.js
* React
* JavaScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Domain-driven application structure

### Database

* PostgreSQL
* Prisma 8 ORM

### Evaluation

* DemoEvaluator
* Optional xAI/Grok API

### Testing

* Vitest

### Deployment

* Vercel
* PostgreSQL

---

# Getting Started

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd designlens
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env
```

Add your PostgreSQL connection string:

```env
DATABASE_URL="your-postgresql-connection-string"
```

AI evaluation is optional.

If you want to enable xAI evaluation:

```env
XAI_API_KEY="your-xai-api-key"
```

Do not commit `.env` or API keys to Git.

---

## 4. Verify the database

Run:

```bash
npx prisma db verify
```

---

## 5. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Testing

Run the automated tests:

```bash
npm test
```

The tests cover important domain behavior including:

* Attempt lifecycle
* Invalid attempt transitions
* Submission validation
* Required submission fields
* Whitespace handling
* Rubric validation
* Rubric total

The project also verifies production compilation with:

```bash
npm run build
```

---

# Evaluation Rubric

The default evaluation rubric contains eight criteria:

| Criterion                  |  Weight |
| -------------------------- | ------: |
| Requirement Understanding  |      15 |
| Class Responsibilities     |      20 |
| Coupling & Cohesion        |      15 |
| Encapsulation & Interfaces |      15 |
| Abstraction / Patterns     |      10 |
| Extensibility              |      10 |
| Edge Cases & Testability   |      10 |
| Explanation Quality        |       5 |
| **Total**                  | **100** |

The rubric is intentionally weighted toward core LLD reasoning rather than pattern usage.

---

# Handling AI Failures

AI responses are treated as untrusted external input.

The AI evaluator validates:

* JSON structure
* Rubric criteria
* Score ranges
* Overall score
* Score total
* Confidence values

If AI evaluation fails, the system falls back to `DemoEvaluator`.

The MVP therefore does not require AI to be available for the core product flow.

---

# Project Structure

```text
src/
│
├── app/
│   ├── api/
│   │   └── attempts/
│   ├── attempt/
│   ├── history/
│   ├── problems/
│   └── page.js
│
├── components/
│
├── data/
│   ├── problems.js
│   └── changeTests.js
│
├── domain/
│   ├── attempt/
│   ├── evaluator/
│   ├── evaluation/
│   ├── problem/
│   └── submission/
│
├── infrastructure/
│   └── evaluators/
│
└── prisma/
```

---

# Design Decisions

## Why a monolith?

The assignment focuses on LLD and domain design.

A monolithic application keeps the core flow simple and makes the domain easier to understand and test.

Microservices, queues and distributed infrastructure would add complexity without being necessary for the MVP.

---

## Why separate Attempt and Submission?

An Attempt represents the learner's practice journey.

A Submission represents the design artifact produced during that journey.

Keeping them separate allows the system to evolve toward:

* Submission versions
* Different submission formats
* Re-evaluation
* Better attempt history

---

## Why use AI only for reasoning?

Some evaluation rules are deterministic.

For example:

```text
Does the submission contain all required sections?
```

This does not require AI.

Other questions are subjective:

```text
Are responsibilities reasonably separated?
```

This can benefit from AI reasoning.

Therefore, DesignLens uses a hybrid approach.

---

## Why not treat a reference solution as the answer?

LLD has multiple valid approaches.

A reference solution can be useful as learning material, but it should not automatically determine whether the learner's design is correct.

DesignLens evaluates the learner's reasoning against requirements and design principles instead.

---

# Current MVP Scope

### Included

* Four LLD problems
* Structured text submissions
* Attempt lifecycle
* PostgreSQL persistence
* AI-assisted evaluation
* Deterministic fallback evaluation
* Evidence-based feedback
* Attempt history
* Change Test
* Automated tests
* Responsive UI

### Intentionally excluded

* Authentication
* Social features
* Leaderboards
* Real-time collaboration
* Complex UML editor
* Payments
* Microservices
* Kubernetes
* Large-scale analytics

The focus is the quality of the core learning loop.

---

# Documentation

Additional design documentation:

* `DESIGN.md` — Architecture and domain design
* `RESEARCH.md` — Product research and design rationale
* `AI_USAGE.md` — AI-assisted development decisions

---

# Future Improvements

Possible future extensions include:

* Code-based submissions
* Diagram submissions
* Version comparison between attempts
* Rule-based evaluator
* Human review
* Background evaluation jobs
* More advanced change simulations
* Authentication and learner profiles

These are intentionally outside the current MVP.

---

# Core Principle

> **Don't grade the design. Review the design.**

DesignLens is intended to help learners understand their design decisions, defend them against requirement changes, and improve their next attempt.

---
