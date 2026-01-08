const express = require("express");
const router = express.Router();

const {
  verifyTeam,
  getQuizQuestions,
  submitQuiz, getLeaderboard
} = require("../controllers/quizController");

router.post("/verify-team", verifyTeam);
router.get("/questions", getQuizQuestions);
router.post("/submit", submitQuiz);
router.get("/leaderboard",getLeaderboard);

module.exports = router;
