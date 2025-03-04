// Server/routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const admissionController = require("../controllers/admissionController");
const { protect } = require("../middlewares/authMiddleware");
const { getUserAdmissions ,approveAdmission} = require("../controllers/admissionController");
router.post("/", protect, admissionController.createAdmission);
router.get("/:admissionId/status", protect, admissionController.getAdmissionStatus);
router.get("/", protect, getUserAdmissions);
router.put("/:id/approve", protect, approveAdmission);
module.exports = router;