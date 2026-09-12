export const DEFAULT_RUBRIC = [
  {
    criterion: "Requirement Understanding",
    weight: 15,
  },
  {
    criterion: "Class Responsibilities",
    weight: 20,
  },
  {
    criterion: "Coupling & Cohesion",
    weight: 15,
  },
  {
    criterion: "Encapsulation & Interfaces",
    weight: 15,
  },
  {
    criterion: "Abstraction / Patterns",
    weight: 10,
  },
  {
    criterion: "Extensibility",
    weight: 10,
  },
  {
    criterion: "Edge Cases & Testability",
    weight: 10,
  },
  {
    criterion: "Explanation Quality",
    weight: 5,
  },
];

export function validateRubric(rubric) {
  const total = rubric.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  if (total !== 100) {
    throw new Error(`Rubric must total 100. Current total: ${total}`);
  }

  return true;
}