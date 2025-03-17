const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const { getUserProfile,updateProfile,uploadProfilePicture,uploadCertificate  } = require("../controllers/userController");



// Get user profile (authenticated users only)
router.get("/profile", authenticate, getUserProfile);

// Update user profile (authenticated users only)
router.put("/profile", authenticate, updateProfile);

// Upload profile picture
router.post("/upload", authenticate, upload.single("image"), uploadProfilePicture);
router.delete("/favorites/:courseId", authenticate, userController.removeFromFavorites);
router.post('/upload-certificate', authenticate, upload.single('certificate'), uploadCertificate);

module.exports = router;
