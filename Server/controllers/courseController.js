const Course = require("../models/Course");
const College = require("../models/College");
const User = require("../models/User");

// Add a new course (admin or college admin)
exports.addCourse = async (req, res) => {
  try {
    let { title, description, fees, duration, collegeId } = req.body;
    const user = req.user; // From auth middleware

    // Auto-assign collegeId for college admins
    if (user.role === "college_admin") {
      if (!user.college) {
        return res.status(403).json({ error: "You are not assigned to any college." });
      }
      collegeId = user.college.toString(); // ✅ Set collegeId from user profile
    }

    // ✅ Allow all authenticated users to add courses
    if (!title || !fees || !duration || !collegeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // ✅ College admin check only when user is a college admin
    // if (user.role === "college_admin" && college.admin.toString() !== user.id) {
    //   return res.status(403).json({ error: "Unauthorized to add courses to this college" });
    // }

    // Create the course
    const course = await Course.create({
      title,
      description,
      fees,
      duration,
      college: collegeId,
    });

    // Add course to the college's courses array
    college.courses.push(course._id);
    await college.save();

    res.status(201).json(course);
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("college");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Add a course to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    
    if (!user.favorites.includes(courseId)) {
      user.favorites.push(courseId);
      await user.save();
    }

    res.json({ success: true, message: "Course added to favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to favorites" });
  }
};