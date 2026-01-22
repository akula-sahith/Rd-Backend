const FinalTeam = require("../models/FinalTeam");
const Round1Submission = require("../models/Round1Submission");
const Round2Submission = require("../models/Round2Submission");
const FinalRoundSubmission = require("../models/FinalRoundSubmission");
exports.submitRound1 = async (req, res) => {
  try {
    const {
      finalTeamId,
      trackSelected,
      problemStatementNumber,
      problemUnderstanding,
      proposedSolution,
      techStack,
      feasibility
    } = req.body;

    // 1️⃣ Validate Final Team
    const team = await FinalTeam.findOne({ finalTeamId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Final team not found"
      });
    }

    // 2️⃣ Prevent duplicate submission
    const alreadySubmitted = await Round1Submission.findOne({ finalTeamId });
    if (alreadySubmitted) {
      return res.status(409).json({
        success: false,
        message: "Round 1 already submitted"
      });
    }

    // 3️⃣ Create submission
    await Round1Submission.create({
      finalTeamId,
      teamName: team.teamName, // 🔥 AUTO-FETCHED
      trackSelected,
      problemStatementNumber,
      problemUnderstanding,
      proposedSolution,
      techStack,
      feasibility
    });

    return res.status(201).json({
      success: true,
      message: "Round 1 submission successful"
    });

  } catch (error) {
    console.error("Round 1 Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.submitRound2 = async (req, res) => {
  try {
    const { finalTeamId } = req.body;

    // 1️⃣ Validate Final Team
    const team = await FinalTeam.findOne({ finalTeamId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Final team not found"
      });
    }

    // 2️⃣ Prevent duplicate submission
    const alreadySubmitted = await Round2Submission.findOne({ finalTeamId });
    if (alreadySubmitted) {
      return res.status(409).json({
        success: false,
        message: "Round 2 already submitted"
      });
    }

    // 3️⃣ Create submission
    await Round2Submission.create({
      finalTeamId: team.finalTeamId,
      teamName: team.teamName,
      trackSelected: req.body.trackSelected,
      problemStatementNumber: req.body.problemStatementNumber,
      prototypeStatus: req.body.prototypeStatus,
      demoVideoLink: req.body.demoVideoLink,
      pendingImplementationDetails: req.body.pendingImplementationDetails
    });

    // ✅ SEND RESPONSE (THIS WAS MISSING)
    return res.status(201).json({
      success: true,
      message: "Round 2 submission successful"
    });

  } catch (error) {
    console.error("Round 2 Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.submitFinalRound = async (req, res) => {
  try {
    const { finalTeamId } = req.body;

    const team = await FinalTeam.findOne({ finalTeamId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Final team not found"
      });
    }

    const alreadySubmitted = await FinalRoundSubmission.findOne({ finalTeamId });
    if (alreadySubmitted) {
      return res.status(409).json({
        success: false,
        message: "Final round already submitted"
      });
    }

    await FinalRoundSubmission.create({
      finalTeamId: team.finalTeamId,
      teamName: team.teamName,
      trackSelected: req.body.trackSelected,
      problemStatement: team.problemStatement,
      liveDeploymentLink: req.body.liveDeploymentLink || null,
      githubRepository: req.body.githubRepository,
      scalabilityAndFutureScope: req.body.scalabilityAndFutureScope
    });

    return res.status(201).json({
      success: true,
      message: "Final round submission successful"
    });

  } catch (error) {
    console.error("Final Round Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllRound1Submissions = async (req, res) => {
  try {
    const submissions = await Round1Submission.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: submissions.length,
      submissions
    });
  } catch (error) {
    console.error("Get Round1 Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getAllRound2Submissions = async (req, res) => {
  try {
    const submissions = await Round2Submission.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: submissions.length,
      submissions
    });
  } catch (error) {
    console.error("Get Round2 Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getAllFinalSubmissions = async (req, res) => {
  try {
    const submissions = await FinalRoundSubmission.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: submissions.length,
      submissions
    });
  } catch (error) {
    console.error("Get Final Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
