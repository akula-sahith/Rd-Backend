const express = require("express");
const router = express.Router();
const { verifyQrScan } = require("../controllers/scanController");

router.post("/scan", verifyQrScan);

module.exports = router;
