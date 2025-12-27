const FakeTeam = require("../models/FakeTeam");
const FakeCounter = require("../models/FakeCounter");


// ➕ REGISTER FAKE TEAM
exports.registerFakeTeam = async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Fake Team Payload:", JSON.stringify(data, null, 2));

    // Generate Fake Registration ID
    const counter = await FakeCounter.findOneAndUpdate(
      { name: "fakeRegistrationId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const fakeRegistrationId =
      counter.seq < 10
        ? `FAKE0${counter.seq}`
        : `FAKE${counter.seq}`;

    // Save Fake Team
    const team = await FakeTeam.create({
      fakeRegistrationId,
      teamName: data.teamName,
      teamSize: data.teamSize,
      problemStatement: data.problemStatement,
      leader: data.leader,
      members: data.members,
    });

    res.status(201).json({
      success: true,
      message: "Fake Team Registered Successfully",
      fakeRegistrationId,
      team,
    });

  } catch (error) {
    console.error("❌ Fake Team Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register fake team",
    });
  }
};


// 📥 GET ALL FAKE TEAMS
exports.getAllFakeTeams = async (req, res) => {
  try {
    const teams = await FakeTeam.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });

  } catch (error) {
    console.error("❌ Fetch Fake Teams Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fake teams",
    });
  }
};
