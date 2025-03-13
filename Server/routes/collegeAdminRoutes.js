const express = require("express");
const router = express.Router();
const { authenticate, isCollegeAdmin } = require("../middlewares/authMiddleware");
const {
  getAdmissions,
  updateAdmissionStatus,
  getCollegeAdminData,
  deleteCourse,
  updateCourse
} = require("../controllers/collegeAdminController");

// Add this route
router.get(
  "/",
  authenticate,
  isCollegeAdmin,
  getCollegeAdminData
);

router.get("/admissions", authenticate, isCollegeAdmin, getAdmissions);
router.put("/admissions/:id", authenticate, isCollegeAdmin, updateAdmissionStatus);
// Delete a course
router.delete("/courses/:courseId",authenticate,isCollegeAdmin,deleteCourse);
// Update a course
router.put("/courses/:courseId",authenticate,isCollegeAdmin,updateCourse);
module.exports = router;