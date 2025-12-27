const express = require("express");
const router = express.Router();

const {
  registerFakeTeam,
  getAllFakeTeams,
} = require("../controllers/fakeTeamController");

// Register fake team
router.post("/fake/register", registerFakeTeam);

// Get all fake teams
router.get("/fake", getAllFakeTeams);

module.exports = router;
