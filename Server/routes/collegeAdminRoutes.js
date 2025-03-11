const express = require("express");
const router = express.Router();
const { authenticate, isCollegeAdmin } = require("../middlewares/authMiddleware");
const {
  getAdmissions,
  updateAdmissionStatus,
  getCollegeAdminData
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

module.exports = router;