const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");
const { loginLimiter, apiLimiter } = require("./middlewares/rateLimitMiddleware");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cloudinary = require("./config/cloudinary");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const logger = require("./config/logger");

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/", apiLimiter);
app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/colleges", collegeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use(errorHandler);


// Test Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configured successfully");

app.listen(PORT, () => console.log("Server running successfully on port:", PORT));