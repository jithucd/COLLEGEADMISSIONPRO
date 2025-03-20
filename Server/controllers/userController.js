const User = require("../models/User");
 const cloudinary = require("../config/cloudinary");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).populate("favorites");
    const user = await User.findById(req.user.id)
    .populate({
      path: "favorites",
      populate: { path: "college", select: "name" }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || "", // ✅ Return profile picture
      certificateUrl: user.certificateUrl || "", // ✅ Return certificate
      favorites: user.favorites,  // ✅ Ensure favorites are included
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Save Cloudinary URL instead of req.file.path
    if (req.file && req.file.path) {
      user.profilePicture = req.file.path;
      await user.save();
      res.status(200).json({ success: true, imageUrl: user.profilePicture });
    } else {
      res.status(400).json({ error: "Invalid file upload" });
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
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

exports.uploadCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Save Cloudinary URL instead of req.file.path
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "certificates", // Store in "certificates" folder in Cloudinary
        resource_type: "image",
      });

      user.certificateUrl = result.secure_url; // ✅ Update the user's certificateUrl field
      await user.save();

      res.status(200).json({ success: true, certificateUrl: user.certificateUrl });
    } else {
      res.status(400).json({ error: "Invalid file upload" });
    }
  } catch (error) {
    console.error("Error uploading certificate:", error);
    res.status(500).json({ error: "Failed to upload certificate" });
  }
};


