export class Submission {
  constructor({
    id,
    attemptId,
    requirements,
    classes,
    relationships,
    designDecisions,
    edgeCases,
  }) {
    if (!id) {
      throw new Error("Submission id is required");
    }

    if (!attemptId) {
      throw new Error("Attempt id is required");
    }

    this.id = id;
    this.attemptId = attemptId;

    this.requirements = requirements?.trim() || "";
    this.classes = classes?.trim() || "";
    this.relationships = relationships?.trim() || "";
    this.designDecisions = designDecisions?.trim() || "";
    this.edgeCases = edgeCases?.trim() || "";

    this.createdAt = new Date();
  }

  isComplete() {
    return Boolean(
      this.requirements &&
      this.classes &&
      this.relationships &&
      this.designDecisions &&
      this.edgeCases
    );
  }
}