const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      required: true,
      default: []
    },
    performanceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
