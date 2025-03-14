const express = require("express");
const dotenv = require("dotenv");
// import cors from 'cors';
const cors =require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");
const { loginLimiter, apiLimiter } = require("./middlewares/rateLimitMiddleware");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
const cloudinary = require("./config/cloudinary");
const admissionRoutes = require("./routes/admissionRoutes");
const collegeAdminRoutes=require("./routes/collegeAdminRoutes");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const logger = require("./config/logger");

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-service.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use("/api/admissions", admissionRoutes);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`); // ✅ Correct logging middleware
  next();
});
app.use("/api/", apiLimiter);
// app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/colleges", collegeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/college-admin", collegeAdminRoutes);
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