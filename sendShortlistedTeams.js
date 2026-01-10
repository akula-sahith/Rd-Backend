import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "./src/models/Team.js";
import ShortlistedTeam from "./src/models/shortlistedTeams.js";

dotenv.config();

// 🔹 Team IDs to shortlist
const teamIdsToShortlist = [
  "RD13",
  "RD20", "RD25", "RD29", "RD34", "RD36", "RD37",
  "RD42", "RD45", "RD46", "RD47", "RD50", "RD52",
  "RD55", "RD60", "RD65", "RD69", "RD70", "RD78",
  "RD81", "RD85", "RD91", "RD93", "RD96", "RD99",
  "RD128", "RD131", "RD135", "RD136", "RD138",
  "RD141", "RD154", "RD159", "RD163", "RD168",
  "RD178", "RD179", "RD183", "RD191", "RD194",
  "RD195", "RD197", "RD203", "RD205", "RD206",
  "RD208", "RD209", "RD211", "RD212", "RD213",
  "RD215", "RD217", "RD223", "RD225", "RD239",
  "RD245", "RD250", "RD252", "RD275", "RD276",
  "RD281", "RD283", "RD293", "RD294", "RD296","RD18", "RD272",
  "RD301", "RD307", "RD308", "RD309", "RD310",
  "RD312", "RD313", "RD319", "RD320", "RD324" , "RD306" , "RD279" , "RD288"
]



const seedShortlistedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 🧹 Optional: clear old shortlisted teams
    await ShortlistedTeam.deleteMany();

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
      problemDomain: team.problemDomain,
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
