const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes here are secured and require JWT authentication token
router.post("/", authMiddleware, employeeController.createEmployee);
router.get("/", authMiddleware, employeeController.getEmployees);
router.get("/:id", authMiddleware, employeeController.getEmployeeById);
router.put("/:id", authMiddleware, employeeController.updateEmployee);
router.delete("/:id", authMiddleware, employeeController.deleteEmployee);

module.exports = router;
