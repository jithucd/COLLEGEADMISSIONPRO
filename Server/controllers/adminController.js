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
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
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