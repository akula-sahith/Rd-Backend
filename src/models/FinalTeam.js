const mongoose = require("mongoose");
const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true
  },

  name: String,           // Final certificate name
  email: String,
  phone: String,
  college: String,

  // 🔐 QR related
  qrToken: String,        // JWT token
  qrUrl: String           // Cloudinary URL
});
const FinalTeamSchema = new mongoose.Schema(
  {
    // 🔐 FINAL TEAM ID (after payment)
    finalTeamId: {
      type: String,
      unique: true,
      required: true
    },

    // 🔗 Original registration reference
    registrationId: {
      type: String,
      required: true
    },

    teamName: String,
    teamSize: Number,
    problemStatement: String,

    // 👑 TEAM LEADER (WITH QR)
    leader: participantSchema,

    // 👥 FINAL MEMBERS (WITH QR)
    members: [participantSchema],

    // 💳 PAYMENT DETAILS
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinalTeam", FinalTeamSchema);
