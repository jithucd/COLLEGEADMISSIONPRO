const User = require("../models/User");
 const cloudinary = require("../config/cloudinary");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate('college');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save Cloudinary URL to user profile
    req.user.profilePicture = req.file.path;
    await req.user.save();

    res.json({ success: true, imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.courseId);
    await user.save();
    res.json({ success: true, message: "Course removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from favorites" });
  }
};