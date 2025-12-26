const Team = require("../models/Team");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ createdAt: -1 }) // latest first
      .select("-__v"); // remove unwanted field

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });

  } catch (error) {
    console.error("❌ Error fetching teams:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};
