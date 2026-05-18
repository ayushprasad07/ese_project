const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// Secured performance analytics summary route
router.get("/", authMiddleware, analyticsController.getAnalytics);

module.exports = router;
