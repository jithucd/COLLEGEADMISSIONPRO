const express = require("express");
const router = express.Router();
const { authenticate, isCollegeAdmin } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");
const collegeController = require("../controllers/collegeController");
const courseController = require("../controllers/courseController");
const adminController = require("../controllers/adminController");
const upload = require("../config/multer");
 const { uploadCollegeImage } = require("../controllers/collegeController");
const College = require('../models/College');

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
      if (req.user.role === "admin"|| req.user.role === "college_admin") return next();
      isCollegeAdmin(req, res, next);
    },
    courseController.addCourse
  );
  router.get("/:id/courses", collegeController.getCourses);


router.get("/colleges/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate("courses");
    if (!college) return res.status(404).json({ error: "College not found" });

    res.json(college);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch college details" });
  }
});
router.put("/:collegeId/status", authenticate, isAdmin, adminController.toggleCollegeStatus);
router.post('/upload-image/:collegeId', authenticate, upload.single('image'), uploadCollegeImage);
router.put('/:id', authenticate, collegeController.updateCollegeDetails);
// router.post('/upload-proof/:collegeId', authenticate, upload.single('proof'), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     // Update the college with the new proof URL
//     const updatedCollege = await College.findByIdAndUpdate(
//       req.params.collegeId,
//       { proofUrl: result.secure_url },
//       { new: true }
//     );
//     res.status(200).json({ url: updatedCollege.proofUrl });
//   } catch (error) {
//     console.error('Error uploading proof:', error);
//     res.status(500).json({ error: 'Failed to upload proof' });
//   }
// });
module.exports = router;
