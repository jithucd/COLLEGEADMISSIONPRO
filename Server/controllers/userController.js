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
    const file = req.file; // File from multer middleware

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile-pictures", // Optional: Organize files in folders
    });

    
    // Save Cloudinary URL to user profile
    const user = await User.findById(req.user.id);
    user.profilePicture = result.secure_url;
    await user.save();


    res.json({ success: true, imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};