const mongoose = require("mongoose");

// 🔹 COMMON PARTICIPANT SCHEMA (Leader + Members)
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

module.exports = mongoose.model("Participant", participantSchema);