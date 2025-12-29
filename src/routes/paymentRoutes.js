const express = require("express");
const router = express.Router();

const { createPaymentAndFinalTeam } = require("../controllers/paymentController.js");

router.post("/create",createPaymentAndFinalTeam);

module.exports = router;