const mongoose = require("mongoose");

const FinalRoundSubmissionSchema = new mongoose.Schema(
  {
    finalTeamId: {
      type: String,
      required: true,
      unique: true // ❗ only one final submission per team
    },

    teamName: {
      type: String,
      required: true
    },

    trackSelected: {
      type: String,
      required: true
    },

    problemStatement: {
      type: String,
      required: true
    },

    liveDeploymentLink: {
      type: String,
      default: null
    },

    githubRepository: {
      type: String,
      required: true
    },

    scalabilityAndFutureScope: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "FinalRoundSubmission",
  FinalRoundSubmissionSchema
);
