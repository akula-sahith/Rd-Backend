import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "./src/models/Team.js";
import ShortlistedTeam from "./src/models/shortlistedTeams.js";

dotenv.config();

// 🔹 Team IDs to shortlist
const teamIdsToShortlist = [
  "RD323"
]



const seedShortlistedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // // 🧹 Optional: clear old shortlisted teams
    // await ShortlistedTeam.deleteMany();

    // 🔍 Fetch teams
    const teams = await Team.find({ registrationId: { $in: teamIdsToShortlist } });

    if (!teams.length) {
      console.log("❌ No matching teams found");
      process.exit(0);
    }

    // 🔁 Map Team → ShortlistedTeam schema
    const shortlistedTeams = teams.map(team => ({
      teamId: team.registrationId,
      teamName: team.teamName,
      problemDomain: team.problemStatement,
      isShortlisted: true
    }));

    // 📥 Insert
    await ShortlistedTeam.insertMany(shortlistedTeams);
    console.log(`✅ ${shortlistedTeams.length} teams shortlisted successfully`);

    // ⚠️ Find missing team IDs
    const existingIds = teams.map(t => t.registrationId);
    const missingIds = teamIdsToShortlist.filter(
      id => !existingIds.includes(id)
    );

    if (missingIds.length) {
      console.log("⚠️ Missing teamIds:", missingIds);
    } else {
      console.log("🎉 All teamIds were found and shortlisted");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding shortlisted teams:", error);
    process.exit(1);
  }
};

seedShortlistedTeams();
