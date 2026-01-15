require("dotenv").config();
const mongoose = require("mongoose");

const FinalTeam = require("./src/models/FinalTeam");
const Participant = require("./src/models/Participant");

const { generateQrToken } = require("./src/utils/generateQrToken");
const { uploadQrToCloudinary } = require("./src/services/CloudService");

async function regenerateAllQrs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    const teams = await FinalTeam.find();
    console.log(`🔁 Found ${teams.length} teams`);

    for (const team of teams) {
      console.log(`\n🚀 Processing ${team.finalTeamId}`);

      /* 🧑‍✈️ LEADER */
      const leaderPid = team.leader.participantId;
      const newLeaderToken = generateQrToken(leaderPid);
      const newLeaderQrUrl = await uploadQrToCloudinary(
        newLeaderToken,
        team.registrationId,
        leaderPid
      );

      team.leader.qrToken = newLeaderToken;
      team.leader.qrUrl = newLeaderQrUrl;

      await Participant.updateOne(
        { participantId: leaderPid },
        {
          qrToken: newLeaderToken,
          qrUrl: newLeaderQrUrl
        }
      );

      console.log(`  ✅ Leader QR updated`);

      /* 👥 MEMBERS */
      for (let i = 0; i < team.members.length; i++) {
        const member = team.members[i];
        const pid = member.participantId;

        const newToken = generateQrToken(pid);
        const newQrUrl = await uploadQrToCloudinary(
          newToken,
          team.registrationId,
          pid
        );

        team.members[i].qrToken = newToken;
        team.members[i].qrUrl = newQrUrl;

        await Participant.updateOne(
          { participantId: pid },
          {
            qrToken: newToken,
            qrUrl: newQrUrl
          }
        );

        console.log(`  ✅ Member ${pid} QR updated`);
      }

      await team.save();
      console.log(`🎯 Team ${team.finalTeamId} DONE`);
    }

    console.log("\n🎉 ALL QR CODES REGENERATED SUCCESSFULLY");
    process.exit(0);

  } catch (err) {
    console.error("❌ QR Regen Failed:", err);
    process.exit(1);
  }
}

regenerateAllQrs();
