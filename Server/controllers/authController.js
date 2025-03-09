const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const College = require("../models/College");
// Signup
exports.signup = async (req, res) => {
  try {
    // Destructure collegeId from req.body
    const { name, email, password, role, collegeId } = req.body;
    console.log("Signup Request Body:", req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Validate collegeId for college_admin role
    if (role === "college_admin") {
      if (!collegeId) {
        return res.status(400).json({ error: "College ID is required for College Admins." });
      }

      // Check if college exists
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      college: role === "college_admin" ? collegeId : null,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// Login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request Body:", req.body); 
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ success: true, token, user });
  } catch (err) {
    console.log("Login request received from origin:", req.headers.origin);
    res.status(500).json({ error: "Login failed" });
  }
};

// Logout 
exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};