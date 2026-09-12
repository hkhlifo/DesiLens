import { Problem } from "../domain/problem/Problem.js";

export const problems = [
    new Problem({
        id: "parking-lot",
        title: "Parking Lot",
        description:
            "Design a parking lot system that can manage different vehicle types, parking spots, entry and exit operations, and parking fees.",
        difficulty: "Easy",
        requirements: [
            "The parking lot should support different vehicle types.",
            "The system should assign an appropriate parking spot.",
            "A vehicle should be able to enter and exit the parking lot.",
            "The system should calculate parking fees.",
            "The design should be easy to extend for new vehicle or pricing rules.",
        ],
    }),

    new Problem({
        id: "elevator-system",
        title: "Elevator System",
        description:
            "Design an elevator system that handles floor requests, elevator movement, and request assignment.",
        difficulty: "Medium",
        requirements: [
            "The system should support multiple elevators.",
            "Users should be able to request an elevator from a floor.",
            "Users inside an elevator should be able to select a destination floor.",
            "The system should decide which elevator handles a request.",
            "The design should allow the elevator selection strategy to change.",
        ],
    }),

    new Problem({
        id: "vending-machine",
        title: "Vending Machine",
        description:
            "Design a vending machine that manages products, payments, inventory, and dispensing.",
        difficulty: "Easy",
        requirements: [
            "The machine should display available products.",
            "Users should be able to select a product.",
            "The machine should accept payment.",
            "The machine should dispense the selected product when payment is sufficient.",
            "The machine should return appropriate change.",
            "The design should handle unavailable products and insufficient payment.",
        ],
    }),

    new Problem({
        id: "library-management",
        title: "Library Management",
        description:
            "Design a library management system that handles books, members, borrowing, returning, and availability.",
        difficulty: "Medium",
        requirements: [
            "The library should maintain information about books.",
            "Members should be able to borrow available books.",
            "Members should be able to return borrowed books.",
            "The system should track book availability.",
            "The design should support different borrowing rules in the future.",
        ],
    }),
];

export function getProblemById(id) {
    return problems.find((problem) => problem.id === id);
}