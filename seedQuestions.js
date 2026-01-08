require("dotenv").config();
const mongoose = require("mongoose");
const QuizQuestion = require("./src/models/QuizQuestion");
const Counter = require("./src/models/Counter");

const questions = [
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyper Tool Transfer Process",
      "Home Transfer Text Protocol",
    ],
    correctAnswer: 0,
    marks: 1,
  },
  {
    question: "Which database is NoSQL?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctAnswer: 2,
    marks: 1,
  },
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

      await QuizQuestion.create({
        questionId,
        ...q,
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
