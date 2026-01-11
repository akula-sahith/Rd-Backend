require("dotenv").config();
const mongoose = require("mongoose");

const FinalTeam = require("./src/models/FinalTeam");
const Team = require("./src/models/Team");

async function syncProblemStatements() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const finalTeams = await FinalTeam.find({});
    console.log(`🔍 Found ${finalTeams.length} FinalTeams`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const finalTeam of finalTeams) {
      const team = await Team.findOne({
        registrationId: finalTeam.registrationId
      });

      if (!team) {
        console.warn(
          `⚠️ Team not found for FinalTeam ${finalTeam.finalTeamId}`
        );
        skippedCount++;
        continue;
      }

      if (finalTeam.problemStatement === team.problemStatement) {
        skippedCount++;
        continue;
      }

      finalTeam.problemStatement = team.problemStatement;
      await finalTeam.save();

      updatedCount++;
      console.log(
        `✅ Updated ${finalTeam.finalTeamId}`
      );
    }

    console.log("\n🎯 Migration Complete");
    console.log(`✔ Updated: ${updatedCount}`);
    console.log(`⏭ Skipped: ${skippedCount}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

syncProblemStatements();
