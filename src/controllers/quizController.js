const Team = require("../models/Team");
const QuizAttempt = require("../models/QuizAttempt");
const QuizQuestion = require("../models/QuizQuestion");
exports.verifyTeam = async (req, res) => {
  const { registrationId } = req.body;

  const team = await Team.findOne({ registrationId });
  if (!team) {
    return res.status(404).json({
      success: false,
      message: "Invalid Registration ID",
    });
  }

  const attempted = await QuizAttempt.findOne({ registrationId });
  if (attempted) {
    return res.status(403).json({
      success: false,
      message: "Quiz already attempted",
    });
  }

  res.status(200).json({
    success: true,
    teamName: team.teamName,
  });
};

exports.getQuizQuestions = async (req, res) => {
  const questions = await QuizQuestion.find().select("-correctAnswer -__v");

  res.status(200).json({
    success: true,
    questions,
  });
};

exports.submitQuiz = async (req, res) => {
  const { registrationId, responses } = req.body;

  const alreadyAttempted = await QuizAttempt.findOne({ registrationId });
  if (alreadyAttempted) {
    return res.status(403).json({
      success: false,
      message: "Quiz already submitted",
    });
  }

  let totalScore = 0;
  const evaluatedAnswers = [];

  for (const r of responses) {
    const question = await QuizQuestion.findOne({
  questionId: r.questionId,
});


    const isCorrect = question.correctAnswer === r.selectedOption;
    const marks = isCorrect ? question.marks : 0;

    totalScore += marks;

    evaluatedAnswers.push({
      questionId: r.questionId,
      selectedOption: r.selectedOption,
      isCorrect,
      marksObtained: marks,
    });
  }

  await QuizAttempt.create({
    registrationId,
    answers: evaluatedAnswers,
    totalScore,
  });

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    totalScore,
  });
};

exports.getLeaderboard = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find()
      .sort({ totalScore: -1, createdAt: 1 })
      .lean();

    const leaderboard = await Promise.all(
      attempts.map(async (attempt, index) => {
        const team = await Team.findOne(
          { registrationId: attempt.registrationId },
          { teamName: 1, leader: 1 }
        );

        return {
          rank: index + 1,
          registrationId: attempt.registrationId,
          teamName: team?.teamName || "Unknown",
          leaderName: team?.leader?.name || "N/A",
          leaderEmail: team?.leader?.email || "N/A",
          score: attempt.totalScore,
          submittedAt: attempt.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });

  } catch (error) {
    console.error("❌ Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};