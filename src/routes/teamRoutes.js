const express = require("express");
const router = express.Router();

const {getAllTeams
} = require("../controllers/teamController");

// GET – Fetch All Teams
router.get("/all", getAllTeams);

module.exports = router;
