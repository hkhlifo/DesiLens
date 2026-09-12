import { Problem } from "../problem/Problem.js";
import {
    Attempt,
    ATTEMPT_STATUS,
} from "./attempt/Attempt.js";
import { Submission } from "./submission/Submission.js";

const problem = new Problem({
    id: "parking-lot",
    title: "Parking Lot",
    description: "Design a parking lot system.",
    difficulty: "Medium",
    requirements: [
        "Support cars and bikes",
        "Assign available parking spots",
        "Generate parking tickets",
        "Process payments",
    ],
});

const attempt = new Attempt({
    id: "attempt-1",
    problemId: problem.id,
});

const submission = new Submission({
    id: "submission-1",
    attemptId: attempt.id,
    requirements:
        "The system should support cars and bikes and assign available spots.",
    classes:
        "ParkingLot, Vehicle, Car, Bike, ParkingSpot, Ticket, Payment",
    relationships:
        "ParkingLot manages ParkingSpot objects. Ticket is associated with Vehicle.",
    designDecisions:
        "Vehicle is represented as a base abstraction with Car and Bike implementations.",
    edgeCases:
        "No available parking spot, invalid vehicle, duplicate ticket.",
});

console.log("Initial:", attempt.status);

attempt.attachSubmission(submission.id);

attempt.submit();

console.log("After submit:", attempt.status);

attempt.startEvaluation();

console.log("Evaluating:", attempt.status);

attempt.completeEvaluation("evaluation-1");

console.log("Completed:", attempt.status);

console.log("Submission valid:", submission.isComplete());

console.log("Expected:", ATTEMPT_STATUS.COMPLETED);