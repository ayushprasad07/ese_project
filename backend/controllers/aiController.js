const Employee = require("../models/Employee");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate Gemini AI performance review & career path recommendation
// @route   POST api/ai-recommendation/:id
// @access  Private
exports.generateRecommendation = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
    You are an expert Senior Human Resources (HR) Consultant and Executive Career Coach.
    
    Evaluate the following employee performance details and compile standard, executive-grade recommendations:
    
    EMPLOYEE DETAILS:
    - Name: ${employee.name}
    - Email: ${employee.email}
    - Department: ${employee.department}
    - Skills: ${employee.skills.join(", ") || "None listed"}
    - Years of Experience: ${employee.experience} years
    - Overall Performance Score: ${employee.performanceScore}%
    
    INSTRUCTIONS FOR GENERATION:
    1. Assess the employee's **PROMOTION READINESS**. Determine if they are ready for advancement based on their ${employee.experience} years of experience and ${employee.performanceScore}% performance score, and state a specific recommendation.
    2. Provide a **TAILORED TRAINING ROADMAP** mapping to their current skills and performance. List specific courses, skill development focus, and target timelines to address their weak points or reinforce leadership capabilities.
    3. State an executive **PERFORMANCE SUMMARY** highlighting:
       - Core strengths (backed by metrics)
       - Bottlenecks/growth limitations
       - Specific actionable steps for their direct supervisor
    4. Keep the output clean, highly structured, professional, and well-styled in Markdown format.
    5. Avoid generic phrases like "As an AI..." or "Based on the data provided...". Direct, professional, and analytical language only.
    `;

    const result = await model.generateContent(prompt);
    const recommendation = result.response.text();

    return res.status(200).json({
      success: true,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        performanceScore: employee.performanceScore,
        experience: employee.experience
      },
      recommendation
    });

  } catch (error) {
    next(error);
  }
};
