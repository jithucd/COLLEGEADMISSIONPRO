const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const courseController = require("../controllers/courseController");

// Get all courses (public)
router.get("/", courseController.getAllCourses);

// Add a course to favorites (authenticated users only)
router.post("/favorites", authenticate, courseController.addToFavorites);


module.exports = router;