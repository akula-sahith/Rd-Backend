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
  const questions = await QuizQuestion.find()
    .select("questionId question options isMultiple marks");

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

    if (!question) continue;

    const correctAnswers = question.correctAnswer; // array
    const isMultiple = correctAnswers.length > 1;

    let isCorrect = false;
    let marks = 0;

    // 🚫 Unanswered
    if (
      r.selectedOption === -1 ||
      r.selectedOption === null ||
      (Array.isArray(r.selectedOption) && r.selectedOption.length === 0)
    ) {
      isCorrect = false;
      marks = 0;
    } else {
      const selected = Array.isArray(r.selectedOption)
        ? r.selectedOption
        : [r.selectedOption];

      // Normalize + sort for comparison
      const sortedSelected = [...selected].sort();
      const sortedCorrect = [...correctAnswers].sort();

      isCorrect =
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((v, i) => v === sortedCorrect[i]);

      marks = isCorrect ? question.marks : 0;
    }

    totalScore += marks;

    evaluatedAnswers.push({
      questionId: question.questionId,
      question: question.question,
      options: question.options,

      correctAnswer: correctAnswers, // 👈 send correct answers
      selectedOption: r.selectedOption,

      isMultiple, // 👈 tells frontend checkbox vs radio
      isCorrect,
      marksObtained: marks,
      totalMarks: question.marks,
    });
  }

  const attempt = await QuizAttempt.create({
    registrationId,
    answers: evaluatedAnswers,
    totalScore,
  });

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    totalScore,
    answers: evaluatedAnswers, // 👈 FULL FEEDBACK
  });
};


exports.getLeaderboard = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find()
      .sort({ totalScore: -1, createdAt: 1 }) // score desc, time asc
      .lean();

    const leaderboard = await Promise.all(
      attempts.map(async (attempt, index) => {
        const team = await Team.findOne(
          { registrationId: attempt.registrationId },
          {
            teamName: 1,
            leader: 1, // includes name, email, college
          }
        ).lean();

        return {
          rank: index + 1,
          registrationId: attempt.registrationId,
          teamName: team?.teamName || "Unknown",
          leaderName: team?.leader?.name || "N/A",
          leaderEmail: team?.leader?.email || "N/A",
          college: team?.leader?.college || "N/A", // ✅ added
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
