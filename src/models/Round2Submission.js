const mongoose = require("mongoose");

const Round2SubmissionSchema = new mongoose.Schema(
  {
    finalTeamId: {
      type: String,
      required: true
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
      required: true
    },
    prototypeStatus: {
      type: String,
      required: true
    },
    demoVideoLink: {
      type: String,
      required: true
    },
    pendingImplementationDetails: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ THIS LINE IS MANDATORY
module.exports = mongoose.model(
  "Round2Submission",
  Round2SubmissionSchema
);
