const express = require("express");
const router = express.Router();
const { authenticate, isCollegeAdmin } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");
const collegeController = require("../controllers/collegeController");
const courseController = require("../controllers/courseController");
const adminController = require("../controllers/adminController");
// Get all colleges (public)
router.get("/", collegeController.getAllColleges);

// Get a single college by ID (public)
router.get("/:id", collegeController.getCollegeById);

router.post("/", authenticate, isAdmin, adminController.createCollege);

// Add a course to a college (admin or college admin)
// router.post("/:id/courses", authenticate, isCollegeAdmin, courseController.addCourse);
router.post(
    "/:id/courses",
    authenticate,
    (req, res, next) => {
      // Allow both admins and college admins
      if (req.user.role === "admin") return next();
      isCollegeAdmin(req, res, next);
    },
    collegeController.addCourse
  );
  router.get("/:id/courses", collegeController.getCourses);
module.exports = router;