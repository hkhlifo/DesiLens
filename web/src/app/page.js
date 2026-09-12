const problems = [
  {
    title: "Parking Lot",
    difficulty: "Medium",
    description:
      "Design a parking system that handles vehicles, spots, tickets and payments.",
    category: "Systems",
  },
  {
    title: "Elevator System",
    difficulty: "Medium",
    description:
      "Design an elevator system that efficiently handles requests across multiple floors.",
    category: "Systems",
  },
  {
    title: "Vending Machine",
    difficulty: "Easy",
    description:
      "Design a vending machine that manages products, inventory, payments and change.",
    category: "Systems",
  },
  {
    title: "Library Management",
    difficulty: "Easy",
    description:
      "Design a library system for books, members, borrowing and returns.",
    category: "Management",
  },
];

const recentAttempts = [
  {
    problem: "Parking Lot",
    score: 78,
    attempt: 2,
    date: "Today",
  },
  {
    problem: "Elevator System",
    score: 71,
    attempt: 1,
    date: "Yesterday",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              D
            </div>

            <span className="text-lg font-semibold tracking-tight">
              DesignLens
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-zinc-400">
            <a href="#problems" className="transition hover:text-white">
              Problems
            </a>

            <a href="#history" className="transition hover:text-white">
              My Attempts
            </a>

            <button className="rounded-lg border border-white/10 px-4 py-2 text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white">
              Demo Learner
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LLD Design Review Platform
          </div>

          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Practice LLD.
            <br />
            <span className="text-zinc-500">Understand your design.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            DesignLens helps you practice real-world Low-Level Design problems
            and understand why your design works, where it becomes fragile,
            and how to improve it.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#problems"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Start practicing →
            </a>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Product principle */}
        <div
          id="how-it-works"
          className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {[
            ["01", "Design", "Think through the problem and model your solution."],
            ["02", "Submit", "Explain your responsibilities, relationships and trade-offs."],
            ["03", "Review", "Get evidence-based feedback instead of a random score."],
            ["04", "Improve", "Retry and see how your design evolves."],
          ].map(([number, title, description]) => (
            <div key={number} className="bg-[#0d0d10] p-6">
              <div className="text-xs font-medium text-zinc-600">{number}</div>
              <h3 className="mt-8 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">Practice</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Choose a design problem
              </h2>
            </div>

            <span className="text-sm text-zinc-600">
              {problems.length} problems
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="group rounded-2xl border border-white/10 bg-[#0d0d10] p-6 transition hover:-translate-y-0.5 hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-zinc-600">
                      {problem.category}
                    </span>

                    <h3 className="mt-2 text-lg font-semibold">
                      {problem.title}
                    </h3>
                  </div>

                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-500">
                    {problem.difficulty}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {problem.description}
                </p>

                <button className="mt-6 text-sm font-medium text-zinc-300 transition group-hover:text-white">
                  Start attempt →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent attempts */}
      <section
        id="history"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div>
            <p className="text-sm font-medium text-zinc-500">Learning loop</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Your recent attempts
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            {recentAttempts.map((attempt, index) => (
              <div
                key={attempt.problem}
                className={`flex items-center justify-between bg-[#0d0d10] p-5 ${index !== recentAttempts.length - 1
                    ? "border-b border-white/10"
                    : ""
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-sm font-semibold">
                    {attempt.score}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{attempt.problem}</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      Attempt #{attempt.attempt} · {attempt.date}
                    </p>
                  </div>
                </div>

                <button className="text-sm text-zinc-500 transition hover:text-white">
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-xs text-zinc-600">
          <span>DesignLens</span>
          <span>Practice. Review. Improve.</span>
        </div>
      </footer>
    </main>
  );
}