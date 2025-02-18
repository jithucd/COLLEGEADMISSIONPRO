const jwt = require("jsonwebtoken");
const User = require("../models/User");
const College = require("../models/College");

exports.authenticate = async (req, res, next) => {
  try {
    
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

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
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  next();
};

// Check if user is a college admin for a specific college
exports.isCollegeAdmin = async (req, res, next) => {
  const { collegeId } = req.params.id;

  // Find the college
  const college = await College.findById(collegeId);
  if (!college) {
    return res.status(404).json({ error: "College not found." });
  }

  // Check if the logged-in user is the admin of this college
  if (college.admin.toString() !== req.user.id) {
    return res.status(403).json({ error: "Access denied. College admin role required." });
  }

  next();
   // Check if user is admin or college admin
  //  if (req.user.role === "admin" || college.admin?.toString() === req.user.id) {
  //   next();
  // } else {
  //   return res.status(403).json({ error: "Admin or college admin access required." });
  
};
