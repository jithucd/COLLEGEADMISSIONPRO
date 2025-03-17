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
    console.log("🔄 Received College Creation Request:", req.body);

    const { name, location, description } = req.body;
    if (!name || !location) {
      console.log("❌ Missing fields:", req.body);
      return res.status(400).json({ error: "Name and location are required" });
    }

    const college = await College.create({ name, location, description, admin: req.user.id });
    console.log("✅ College Created Successfully:", college);

    res.status(201).json({ success: true, college });
  } catch (err) {
    console.error("❌ Failed to create college:", err);
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
// Toggle College Status


exports.toggleCollegeStatus = async (req, res) => {
  const { collegeId } = req.params;
  const { active } = req.body;

  try {
    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      { active },
      { new: true } // ✅ Return the updated document
    );

    if (!updatedCollege) {
      return res.status(404).json({ error: "College not found" });
    }

    res.status(200).json({ success: true, college: updatedCollege });
  } catch (error) {
    console.error("Error toggling college status:", error);
    res.status(500).json({ error: "Failed to update college status" });
  }
};





// Toggle User Status
exports.toggleUserStatus = async (req, res) => {
  try {
    console.log("🔄 Received toggle request for User ID:", req.params.userId, "Set active:", req.body.active);

    // Find user before updating
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log("❌ User not found in DB:", req.params.userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Found user:", user.name, "| Current Status:", user.active);

    // Update user status
    user.active = req.body.active;
    await user.save();

    console.log("🔄 After Update - User Active Status:", user.active);

    // If user is a college admin, update corresponding college status
    if (user.role === "college_admin") {
      console.log("🔍 Searching for college with admin ID:", user._id);
      
      const college = await College.findOne({ admin: user._id });
      
      if (!college) {
        console.log("❌ No college found for this admin. Possible issue with the database.");
      } else {
        console.log("✅ College found:", college.name, "| Updating status...");
        college.active = req.body.active;
        await college.save();
        console.log("✅ College status updated successfully.");
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Failed to toggle user status:", err);
    res.status(500).json({ error: "Failed to toggle user status" });
  }
};

// Get college proof image
exports.getCollegeProof = async (req, res) => {
  try {
    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    if (!college.proofUrl) {
      return res.status(404).json({ error: "No proof document available" });
    }

    res.json({ proofUrl: college.proofUrl });
  } catch (err) {
    console.error("❌ Failed to get proof document:", err);
    res.status(500).json({ error: "Failed to get proof document" });
  }
};

