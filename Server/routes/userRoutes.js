const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const { upload } = require("../utils/fileUpload"); // Multer middleware


// Get user profile (authenticated users only)
router.get("/profile", authenticate, userController.getProfile);

// Update user profile (authenticated users only)
router.put("/profile", authenticate, userController.updateProfile);

// Upload profile picture
router.post("/upload-profile-picture", upload.single("image"), userController.uploadProfilePicture);
router.get('/me', authenticate, userController.getProfile);

module.exports = router;
