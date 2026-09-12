export class Problem {
  constructor({
    id,
    title,
    description,
    difficulty,
    requirements,
  }) {
    if (!id) {
      throw new Error("Problem id is required");
    }

    if (!title) {
      throw new Error("Problem title is required");
    }

    if (!requirements || requirements.length === 0) {
      throw new Error("Problem must have at least one requirement");
    }

    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.requirements = requirements;
  }
}