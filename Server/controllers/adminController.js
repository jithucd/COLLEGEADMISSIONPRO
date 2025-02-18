const User = require("../models/User");
const College = require("../models/College");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
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
    const college = await College.create({ name, location, description });
    res.status(201).json({ success: true, college });
  } catch (err) {
    res.status(500).json({ error: "Failed to create college" });
  }
};