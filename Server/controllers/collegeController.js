const College = require("../models/College");
const cloudinary = require("../config/cloudinary");
const Course = require("../models/Course");
const fs = require('fs');
// Get all colleges
exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({}, 'name location description imageUrl');
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

exports.uploadCollegeImage = async (req, res) => {
  try {
    const { collegeId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    if (result) {
      const updatedCollege = await College.findByIdAndUpdate(
        collegeId,
        { imageUrl: result.secure_url },
        { new: true }
      ).populate("courses"); 

      if (!updatedCollege) {
        return res.status(404).json({ message: "College not found" });
      }

      fs.unlinkSync(req.file.path);

      res.status(200).json({ message: "Image uploaded successfully", updatedCollege });
    } else {
      res.status(500).json({ message: "Failed to upload image" });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCollegeDetails = async (req, res) => {
  const { name, location, proofUrl, description } = req.body;
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { name, location, proofUrl, description },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update college details" });
  }
};
