const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      unique: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number, // index of option
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);
