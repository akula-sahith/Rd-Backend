require("dotenv").config(); // MUST be first

const mongoose = require("mongoose");
const Team = require("./src/models/Team");
const sendRegistrationEmail = require("./src/utils/sendEmail");

const REGISTRATION_ID = "RD164"; // 🔴 ONLY THIS IS HARDCODED

(async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 2️⃣ Fetch team by registrationId
    const team = await Team.findOne({ registrationId: REGISTRATION_ID });

    if (!team) {
      throw new Error(`Team not found for ID ${REGISTRATION_ID}`);
    }

    // 3️⃣ Prepare members array
    const members = [
      team.leader.name,
      team.members?.member2?.name,
      team.members?.member3?.name,
      team.members?.member4?.name,
    ].filter(Boolean); // removes undefined/null

    // 4️⃣ Send email
    await sendRegistrationEmail({
      toEmail: team.leader.email, // ✅ leader email
      toName: team.leader.name,   // ✅ leader name
      registrationId: team.registrationId,
      teamName: team.teamName,
      teamSize: team.teamSize,
      members,
    });

    console.log("✅ Email sent successfully for", REGISTRATION_ID);

  } catch (error) {
    console.error("❌ Script failed");
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
