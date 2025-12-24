const express = require("express");
const router = express.Router();
const { registerTeam } = require("../controllers/registrationController");

router.post("/register", registerTeam);

module.exports = router;
