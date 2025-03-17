const express = require("express");
const router = express.Router();
const multer = require('multer');
const { authenticate, isCollegeAdmin } = require("../middlewares/authMiddleware");
const {
  getAdmissions,
  updateAdmissionStatus,
  getCollegeAdminData,
  deleteCourse,
  updateCourse,
  getCollegeProof 
} = require("../controllers/collegeAdminController");
const cloudinary = require('../config/cloudinary');
const storage = multer.diskStorage({});
const upload = multer({ storage });
const College = require('../models/College');
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
router.get('/proof/:collegeId', getCollegeProof);
router.post('/upload-proof/:id', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      { proofUrl: result.secure_url },
      { new: true }
    );

    res.status(200).json({ url: updatedCollege.proofUrl });
  } catch (error) {
    console.error('Error uploading proof:', error);
    res.status(500).json({ error: 'Failed to upload proof' });
  }
});

module.exports = router;