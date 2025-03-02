const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const {upload} = require("../middlewares/uploadMiddlewares");
const { uploadProfilePicture } = require("../controllers/userController");



// Get user profile (authenticated users only)
router.get("/profile", authenticate, userController.getProfile);

// Update user profile (authenticated users only)
router.put("/profile", authenticate, userController.updateProfile);

// Upload profile picture
router.post("/upload", authenticate, upload.single("image"), uploadProfilePicture);
// router.post("/upload-profile-picture", upload.single("image"), userController.uploadProfilePicture);
router.get('/me', authenticate, userController.getProfile);
router.delete("/favorites/:courseId", authenticate, userController.removeFromFavorites);
module.exports = router;
