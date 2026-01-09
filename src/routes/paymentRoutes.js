const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const {
  createPaymentAndFinalTeam
} = require("../controllers/paymentController");

router.post(
  "/pay",
  upload.fields([
    { name: "leaderPaymentProof", maxCount: 1 },
    { name: "member2PaymentProof", maxCount: 1 },
    { name: "member3PaymentProof", maxCount: 1 },
    { name: "member4PaymentProof", maxCount: 1 }
  ]),
  createPaymentAndFinalTeam
);

module.exports = router;
