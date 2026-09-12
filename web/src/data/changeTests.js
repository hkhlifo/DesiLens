export const changeTests = {
    "parking-lot": {
        title: "Pricing rules have changed",
        scenario:
            "Parking fees must now vary based on vehicle type, parking duration, and peak or off-peak hours.",
        questions: [
            "Which class or responsibility in your design would be affected?",
            "What would you add or modify to support this change?",
            "Which existing parts of your design should remain unchanged?",
            "Would you introduce or modify an abstraction?",
            "Why would your approach make future pricing changes easier?",
        ],
    },

    "elevator-system": {
        title: "Elevator assignment rules have changed",
        scenario:
            "The building now wants to support different elevator selection strategies depending on traffic conditions.",
        questions: [
            "Which class or responsibility would be affected?",
            "What would you add or modify?",
            "Which existing parts should remain unchanged?",
            "Would you introduce an abstraction?",
            "Why would your design make future strategies easier to add?",
        ],
    },

    "vending-machine": {
        title: "Payment methods have changed",
        scenario:
            "The vending machine must now support cash, cards, and a new digital payment method.",
        questions: [
            "Which class or responsibility would be affected?",
            "What would you add or modify?",
            "Which existing parts should remain unchanged?",
            "Would you introduce an abstraction?",
            "Why would your design make future payment methods easier to add?",
        ],
    },

    "library-management": {
        title: "Borrowing rules have changed",
        scenario:
            "The library now wants different borrowing limits and loan durations for different member types.",
        questions: [
            "Which class or responsibility would be affected?",
            "What would you add or modify?",
            "Which existing parts should remain unchanged?",
            "Would you introduce an abstraction?",
            "Why would your design make future borrowing rules easier to add?",
        ],
    },
};

export function getChangeTestByProblemId(problemId) {
    return changeTests[problemId];
}