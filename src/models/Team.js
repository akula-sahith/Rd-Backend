const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const teamSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
    },

    teamName: { type: String, required: true },
    teamSize: { type: Number, required: true },
    problemStatement: { type: String, required: true },

    leader: {
      name: String,
      email: String,
      phone: String,
      college: String,
      department: String,
      year: String,
    },

    members: {
      member2: Object,
      member3: Object,
      member4: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
