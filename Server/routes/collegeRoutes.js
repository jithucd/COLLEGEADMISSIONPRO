const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const collegeController = require("../controllers/collegeController");
const courseController = require("../controllers/courseController");

// Get all colleges (public)
router.get("/", collegeController.getAllColleges);

// Get a single college by ID (public)
router.get("/:id", collegeController.getCollegeById);
// Add a course to a college (admin or college admin)
router.post("/:id/courses",authenticate,(req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "college_admin") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  },
  courseController.addCourse
);

module.exports = router;