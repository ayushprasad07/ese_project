const Employee = require("../models/Employee");

// Helper validator for email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// @desc    Onboard a new employee
// @route   POST api/employees
// @access  Private
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Strict Validations for exactly 6 fields
    if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required onboarding fields. Please supply Name, Email, Department, Skills, Performance Score, and Years of Experience."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format."
      });
    }

    const parsedExperience = Number(experience);
    if (isNaN(parsedExperience) || parsedExperience < 0) {
      return res.status(400).json({
        success: false,
        message: "Years of Experience must be a non-negative number."
      });
    }

    const parsedScore = Number(performanceScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      return res.status(400).json({
        success: false,
        message: "Performance Score must be a number between 0 and 100."
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills must be a non-empty array of core competencies."
      });
    }

    // Check unique email
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "An employee record with this email address is already onboarded."
      });
    }

    const newEmployee = new Employee({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department.trim(),
      skills,
      performanceScore: parsedScore,
      experience: parsedExperience
    });

    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Employee profile successfully onboarded.",
      employee: newEmployee
    });

  } catch (error) {
    next(error); // Global Error Middleware handles DB validations
  }
};

// @desc    Retrieve all employees
// @route   GET api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    return res.status(200).json({
      success: true,
      message: "Employee roster fetched successfully.",
      employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve a single employee's details
// @route   GET api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found."
      });
    }
    return res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found."
      });
    }

    // Input Validations if fields are being updated
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format."
      });
    }

    if (experience !== undefined) {
      const parsedExperience = Number(experience);
      if (isNaN(parsedExperience) || parsedExperience < 0) {
        return res.status(400).json({
          success: false,
          message: "Years of Experience must be a non-negative number."
        });
      }
      employee.experience = parsedExperience;
    }

    if (performanceScore !== undefined) {
      const parsedScore = Number(performanceScore);
      if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
        return res.status(400).json({
          success: false,
          message: "Performance Score must be a number between 0 and 100."
        });
      }
      employee.performanceScore = parsedScore;
    }

    if (skills) {
      if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Skills must be a non-empty array."
        });
      }
      employee.skills = skills;
    }

    // Apply other updates
    if (name) employee.name = name.trim();
    if (email) employee.email = email.toLowerCase().trim();
    if (department) employee.department = department.trim();

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee profile successfully updated.",
      employee
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Offboard an employee
// @route   DELETE api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found."
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee profile offboarded successfully."
    });
  } catch (error) {
    next(error);
  }
};
