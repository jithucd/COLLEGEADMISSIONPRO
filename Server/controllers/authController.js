const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const College = require("../models/College");
// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, college } = req.body;
    console.log("Signup Request Body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    let newCollege = null;
    if (role === "college_admin" && college?.name && college?.location) {
      newCollege = await College.create({
        name: college.name,
        location: college.location,
        proof: college.proof || null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      college: newCollege ? newCollege._id : null,
    });
 // ✅ Assign admin to the college after user creation
 if (role === "college_admin" && newCollege?._id) {
  await College.findByIdAndUpdate(
    newCollege._id,
    { admin: user._id }
  );
}
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