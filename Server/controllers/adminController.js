const User = require("../models/User");
const College = require("../models/College");
const Course = require("../models/Course");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Fetching users..."); 
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


// Delete a user
exports.deleteUser = async (req, res) => {
  try {
      console.log("Delete request for user ID:", req.params.userId);
      const user = await User.findById(req.params.userId);
      
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      await User.findByIdAndDelete(req.params.userId);
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Something went wrong!" });
  }
};
// Create a college
exports.createCollege = async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const college = await College.create({ name, location, description,admin: req.user.id  });
    res.status(201).json({ success: true, college });
  } catch (err) {
    res.status(500).json({ error: "Failed to create college" });
  }
};
exports.updateUserRole = async (req, res) => {
  try {
      
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};

exports.approveCollege = async (req, res) => {
  try {
    
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json({ success: true, college });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve college" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalCourses = await Course.countDocuments();
    
    res.json({
      totalUsers,
      totalColleges,
      totalCourses
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};
exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};