const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema(
  {
    participantId: { type: String, unique: true },

    finalTeamId: String,
    registrationId: String,

    name: String,
    role: {
      type: String,
      enum: ["LEADER", "MEMBER"]
    },

    attendance: { type: Boolean, default: false },
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },

    qrToken: String // will be filled next step
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", ParticipantSchema);
