require("dotenv").config();
const mongoose = require("mongoose");
const ShortlistedTeam = require("./src/models/shortlistedTeams");

const shortlistedTeams = [
  {
    teamId: "TEAM001",
    teamName: "CodeWarriors",
    problemDomain: "AI Healthcare"
  },
  {
    teamId: "TEAM002",
    teamName: "BugSlayers",
    problemDomain: "FinTech"
  },
  {
    teamId: "TEAM003",
    teamName: "DataStorm",
    problemDomain: "Smart Cities"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ShortlistedTeam.insertMany(shortlistedTeams);
    console.log("✅ Shortlisted teams inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
