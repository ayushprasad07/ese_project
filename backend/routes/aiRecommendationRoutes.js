const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// Secured AI consultation recommendations engine route
router.post("/:id", authMiddleware, aiController.generateRecommendation);

module.exports = router;
