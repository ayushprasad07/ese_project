const Employee = require("../models/Employee");

// @desc    Get aggregated performance statistics and leaderboard
// @route   GET api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalEmployees: 0,
          averageScore: 0,
          uniqueSkillsCount: 0,
          departmentBreakdown: [],
          leaderboard: []
        }
      });
    }

    let totalScore = 0;
    const deptStats = {};
    const skillSet = new Set();

    employees.forEach((emp) => {
      totalScore += emp.performanceScore || 0;
      
      if (emp.skills && Array.isArray(emp.skills)) {
        emp.skills.forEach(s => skillSet.add(s.trim().toLowerCase()));
      }

      const dept = emp.department || "Unassigned";
      if (!deptStats[dept]) {
        deptStats[dept] = { sum: 0, count: 0 };
      }
      deptStats[dept].sum += emp.performanceScore || 0;
      deptStats[dept].count += 1;
    });

    const averageScore = Math.round(totalScore / employees.length);
    const uniqueSkillsCount = skillSet.size;

    const departmentBreakdown = Object.keys(deptStats).map(dept => ({
      department: dept,
      avgScore: Math.round(deptStats[dept].sum / deptStats[dept].count),
      employeeCount: deptStats[dept].count
    }));

    const leaderboard = [...employees]
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 10)
      .map(emp => ({
        id: emp._id,
        name: emp.name,
        department: emp.department,
        performanceScore: emp.performanceScore,
        experience: emp.experience
      }));

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployees: employees.length,
        averageScore,
        uniqueSkillsCount,
        departmentBreakdown,
        leaderboard
      }
    });

  } catch (error) {
    next(error);
  }
};
