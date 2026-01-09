require("dotenv").config();
const mongoose = require("mongoose");
const QuizQuestion = require("./src/models/QuizQuestion");
const Counter = require("./src/models/Counter");

const questions = [
  {
    question: "Which statement about time complexity is TRUE?",
    options: [
      "Best-case complexity is always ignored",
      "Worst-case complexity gives the upper bound",
      "Average-case is always same as worst-case",
      "Space complexity includes input size"
    ],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "Which data structure is MOST suitable to detect cycles in an undirected graph?",
    options: ["Queue", "Stack", "Union-Find (Disjoint Set)", "Array"],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which problem CANNOT be solved using greedy strategy?",
    options: [
      "Kruskal’s Algorithm",
      "Prim’s Algorithm",
      "Fractional Knapsack",
      "0/1 Knapsack"
    ],
    correctAnswer: 3,
    marks: 1,
  },
  {
    question: "Which statements about hash tables are TRUE?",
    options: [
      "Collisions are unavoidable",
      "Chaining uses linked structures",
      "Worst-case search is always O(1)",
      "Rehashing improves distribution"
    ],
    correctAnswer: [0, 1, 3],
    marks: 2,
  },
  {
    question: "Which statements about graph traversal are TRUE?",
    options: [
      "DFS uses stack or recursion",
      "BFS works best for weighted graphs",
      "DAGs allow topological sorting",
      "BFS uses less memory than DFS"
    ],
    correctAnswer: [0, 2],
    marks: 2,
  },
  {
    question: "Which statement about Java OOP concepts is CORRECT?",
    options: [
      "Encapsulation restricts direct access to data, abstraction exposes essential behavior",
      "Abstraction is achieved only using private variables",
      "Encapsulation and abstraction are the same",
      "Abstraction prevents method overriding"
    ],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "How many stars are printed by the given nested loop?",
    options: ["10", "15", "20", "25"],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "Which statement about the nested loop execution is TRUE?",
    options: [
      "Inner loop executes more times as i increases",
      "Inner loop executes fewer times as i increases",
      "Both loops run constant times",
      "Time complexity is O(n)"
    ],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "What is the time complexity of the given nested loop?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Indexes in DBMS are mainly used to:",
    options: [
      "Improve INSERT performance",
      "Reduce disk space usage",
      "Speed up SELECT queries",
      "Eliminate full table scans"
    ],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which ACID properties statements are TRUE?",
    options: [
      "Atomicity prevents partial execution",
      "Isolation avoids concurrency issues",
      "Durability avoids deadlocks",
      "Consistency enforces integrity rules"
    ],
    correctAnswer: [0, 1, 3],
    marks: 2,
  },
  {
    question: "Which is the MOST efficient way to process database result sets?",
    options: [
      "Nested loops for each column",
      "Single loop over result set",
      "Repeated database queries",
      "Recursion per row"
    ],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PUT", "PATCH", "CONNECT"],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "XSS attacks mainly occur due to:",
    options: [
      "Broken authentication",
      "Unsanitized input",
      "Weak encryption",
      "Open ports"
    ],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "Which runs JavaScript in parallel without blocking the UI thread?",
    options: [
      "Web Workers",
      "Service Workers",
      "Cookies",
      "Local Storage"
    ],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "Which mobile app architecture best supports testability?",
    options: ["MVC", "MVP", "MVVM", "Monolithic"],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which factors affect mobile app performance?",
    options: [
      "Memory management",
      "Excessive background services",
      "Network optimization",
      "Lifecycle handling"
    ],
    correctAnswer: [0, 2, 3],
    marks: 2,
  },
  {
    question: "Which are core properties of an AI agent?",
    options: [
      "Perception",
      "Autonomy",
      "Static execution",
      "Action capability"
    ],
    correctAnswer: [0, 1, 3],
    marks: 2,
  },
  {
    question: "In reinforcement learning, learning is driven by:",
    options: ["Labels", "Loss functions", "Rewards", "Rules"],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which are properties of quantum computing?",
    options: [
      "Superposition",
      "Entanglement",
      "Determinism",
      "Probabilistic output"
    ],
    correctAnswer: [0, 1, 3],
    marks: 2,
  },
  {
    question: "Quantum computers are most effective for:",
    options: [
      "Sorting",
      "Searching text",
      "Prime factorization",
      "File compression"
    ],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which rendering approach improves SEO by generating HTML on the server?",
    options: [
      "Client-Side Rendering",
      "Static Rendering",
      "Server-Side Rendering",
      "Incremental Rendering"
    ],
    correctAnswer: 2,
    marks: 1,
  },
  {
    question: "Which issues are commonly observed in Large Language Models?",
    options: [
      "Hallucinated outputs",
      "Bias from training data",
      "Guaranteed correctness",
      "Sensitivity to prompts"
    ],
    correctAnswer: [0, 1, 3],
    marks: 2,
  },
  {
    question: "Which mechanism maintains authentication across HTTP requests?",
    options: ["Cookies", "HTTP headers", "URL parameters", "DNS records"],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "Which factor most impacts mobile battery consumption?",
    options: [
      "UI color themes",
      "Background services and sensors",
      "Screen resolution",
      "App icon size"
    ],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "How many handshakes occur if 50 people each shake hands once?",
    options: ["1225", "2450", "1250", "2500"],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "The person is the son of my grandfather’s only son. Who is he?",
    options: ["Brother", "Son", "Cousin", "Myself"],
    correctAnswer: 3,
    marks: 1,
  },
  {
    question: "Find the next number: 1, 4, 13, 40, 121, ?",
    options: ["364", "361", "363", "360"],
    correctAnswer: 1,
    marks: 1,
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyper Tool Transfer Process",
      "Home Transfer Text Protocol"
    ],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "Which statement correctly describes NVIDIA’s Blackwell GPU architecture announced in 2024?",
    options: [
      "Supports trillion-parameter models at much lower cost and energy",
      "Designed only for gaming",
      "Uses AMD ROCm stack",
      "Has no AI acceleration features"
    ],
    correctAnswer: 0,
    marks: 1,
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await QuizQuestion.deleteMany();
    await Counter.deleteOne({ name: "questionId" });

  for (const q of questions) {
  const counter = await Counter.findOneAndUpdate(
    { name: "questionId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const questionId =
    counter.seq < 10 ? `Q0${counter.seq}` : `Q${counter.seq}`;

  const isMultiple = Array.isArray(q.correctAnswer);

  await QuizQuestion.create({
    questionId,
    question: q.question,
    options: q.options,
    correctAnswer: isMultiple ? q.correctAnswer : [q.correctAnswer],
    isMultiple,
    marks: q.marks,
  });

  console.log(`➕ Inserted ${questionId}`);
}


    console.log("🎯 Questions seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
