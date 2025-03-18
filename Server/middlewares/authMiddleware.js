const jwt = require("jsonwebtoken");
const User = require("../models/User");
const College = require("../models/College");
const mongoose = require("mongoose");

exports.authenticate = async (req, res, next) => {
  try {

  //  const token = req.header("Authorization")?.split(" ")[1];
  const token = req.headers.authorization?.split(" ")[1];
  //   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  //     expiresIn: "1h",
  // });
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    /*  */
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" || !req.user) {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  next();
};


exports.isCollegeAdmin = async (req, res, next) => {
  try {
    console.log("Middleware hit - isCollegeAdmin");
    console.log("Authenticated user ID:", req.user?.id);

    const adminId = new mongoose.Types.ObjectId(req.user.id);

    // ✅ Rely on the `pre('find')` hook to populate admin
    const college = await College.findOne({ admin: adminId });

    if (!college) {
      console.log("No college found for this admin.");
      return res.status(404).json({ error: "College not found." });
    }

    // ✅ Add null check for populated admin
    if (!college.admin || !college.admin._id || String(college.admin._id) !== String(req.user.id)) {
      console.log("Admin mismatch:", String(college.admin?._id), "vs", String(req.user.id));
      return res.status(403).json({ error: "Unauthorized action." });
    }
    
    
    

    console.log("College found:", college.name, "Admin Name:", college.admin.name);

    next();
  } catch (err) {
    console.error("Error in isCollegeAdmin:", err);
    res.status(500).json({ error: "Server error." });
  }
};


exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "No token provided" });
  }
};
