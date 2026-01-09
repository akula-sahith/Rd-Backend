const mongoose = require("mongoose");

const ShortlistedTeamSchema = new mongoose.Schema({
  teamId: { type: String, unique: true },
  teamName: String,
  problemDomain: String,
  isShortlisted: { type: Boolean, default: true }
});

module.exports = mongoose.model("ShortlistedTeam", ShortlistedTeamSchema);
