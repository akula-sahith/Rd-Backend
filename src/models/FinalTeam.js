const mongoose = require("mongoose");

const finalMemberSchema = new mongoose.Schema({
  name: String,
  participantId: String
});

const FinalTeamSchema = new mongoose.Schema(
  {
    // 🔐 NEW FINAL TEAM ID (POST PAYMENT)
    finalTeamId: {
      type: String,
      unique: true,
      required: true
    },

    // 🔗 Reference to old registration
    registrationId: {
      type: String,
      required: true
    },

    teamName: String,
    teamSize: Number,
    problemStatement: String,

    leader: {
      name: String,          // FINAL NAME (certificate)
      email: String,
      phone: String,
      college: String,
      department: String,
      year: String,
      participantId: String
    },

    members: [finalMemberSchema],

    payment: {
      paymentId: String,
      amount: Number,
      paidAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinalTeam", FinalTeamSchema);
