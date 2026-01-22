const mongoose = require("mongoose");

const Round1SubmissionSchema = new mongoose.Schema(
  {
    finalTeamId: {
      type: String,
      required: true,
      index: true
    },

    teamName: {
      type: String,
      required: true
    },

    trackSelected: {
      type: String,
      required: true
    },

    problemStatementNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    problemUnderstanding: {
      type: String,
      required: true
    },

    proposedSolution: {
      type: String,
      required: true
    },

    techStack: {
      type: String,
      required: true
    },

    feasibility: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Round1Submission", Round1SubmissionSchema);
