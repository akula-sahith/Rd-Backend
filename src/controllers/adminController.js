const Participant = require("../models/Participant");
const FinalTeam = require("../models/FinalTeam");

exports.getTeamsDashboard = async (req, res) => {
  try {
    // Fetch all teams
    const teams = await FinalTeam.find().lean();

    // Fetch all participants
    const participants = await Participant.find().lean();

    // Group participants by team
    const teamMap = {};

    participants.forEach((p) => {
      if (!teamMap[p.finalTeamId]) {
        teamMap[p.finalTeamId] = [];
      }
      teamMap[p.finalTeamId].push(p);
    });

    // Build dashboard response
    const dashboardData = teams.map((team) => {
      const members = teamMap[team.finalTeamId] || [];

      return {
        finalTeamId: team.finalTeamId,
        teamName: team.teamName,

        members: members.map((m) => ({
          participantId: m.participantId,
          name: m.name,
          attendance: m.attendance,
          breakfast: m.breakfast,
          lunch: m.lunch,
          dinner: m.dinner,
          snacks: m.snacks
        })),

        // Team-level status (all members)
        attendanceDone: members.every((m) => m.attendance),
        breakfastDone: members.every((m) => m.breakfast),
        lunchDone: members.every((m) => m.lunch),
        dinnerDone: members.every((m) => m.dinner),
        snacksDone: members.every((m) => m.snacks)
      };
    });

    return res.status(200).json({
      success: true,
      teams: dashboardData
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalTeams = await FinalTeam.countDocuments();
    const totalParticipants = await Participant.countDocuments();

    const attendanceCount = await Participant.countDocuments({ attendance: true });
    const breakfastCount = await Participant.countDocuments({ breakfast: true });
    const lunchCount = await Participant.countDocuments({ lunch: true });
    const dinnerCount = await Participant.countDocuments({ dinner: true });
    const snacksCount = await Participant.countDocuments({ snacks: true });

    return res.status(200).json({
      success: true,
      stats: {
        totalTeams,
        totalParticipants,
        attendanceCount,
        breakfastCount,
        lunchCount,
        dinnerCount,
        snacksCount
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
