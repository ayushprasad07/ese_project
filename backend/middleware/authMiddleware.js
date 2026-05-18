const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization header, access denied."
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing, access denied."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "matchpro_secret_key_2026");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired, authorization denied."
    });
  }
};

module.exports = authMiddleware;
