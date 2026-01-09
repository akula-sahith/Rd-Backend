const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },

    answers: [
      {
        questionId: String,
        selectedOption: [Number],
        isCorrect: Boolean,
        marksObtained: Number,
      },
    ],

    totalScore: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
