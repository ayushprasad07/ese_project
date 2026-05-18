const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes Mounts
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/ai-recommendation", require("./routes/aiRecommendationRoutes"));

app.get("/", (req, res) => {
  res.send("MatchPro Performance Tracker API is online");
});

// Centralized Academic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express Caught Global Error:", err.stack || err.message);
  
  // Custom parsing for database validation errors or duplicate keys
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(val => val.message).join(', ')
    });
  }

  if (err.code && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error: Field value already exists in the system.'
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(3000, () => {
  console.log("Server started on port http://localhost:3000");
});