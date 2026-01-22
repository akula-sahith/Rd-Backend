const express = require("express");
const router = express.Router();

const {
  submitRound1,
  submitRound2,
  submitFinalRound,

  getAllRound1Submissions,
  getAllRound2Submissions,
  getAllFinalSubmissions,
  getTeamSubmissions
} = require("../controllers/submissionController")

// 🔹 ROUND 1 – Idea Submission
router.post("/round1/submit", submitRound1);

// 🔹 ROUND 2 – Prototype Submission
router.post("/round2/submit", submitRound2);

// 🔹 FINAL ROUND – Final Submission
router.post("/final/submit", submitFinalRound);

router.get("/round1", getAllRound1Submissions);
router.get("/round2", getAllRound2Submissions);
router.get("/final", getAllFinalSubmissions);

module.exports = router;
