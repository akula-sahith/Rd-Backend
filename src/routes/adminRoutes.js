const express = require("express");
const router = express.Router();
const {
  getTeamsDashboard,
  getDashboardStats
} = require("../controllers/adminController");

router.get("/admin/teams", getTeamsDashboard);
router.get("/admin/stats", getDashboardStats);

module.exports = router;
