const College = require("../models/College");
const Course = require("../models/Course");
// Get all colleges
exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};

// Get a single college by ID
exports.getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findById(id).populate("courses");
    if (!college) return res.status(404).json({ error: "College not found" });
    res.json(college);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch college" });
  }
};

// Add a course to a college
exports.addCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fees, duration } = req.body;

    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    const course = await Course.create({ title, description, fees, duration, college: id });
    college.courses.push(course._id);
    await college.save();

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { id } = req.params; // College ID from URL

    // Check if college exists
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // Fetch courses associated with this college
    const courses = await Course.find({ college: id });

    res.json({ success: true, courses });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};