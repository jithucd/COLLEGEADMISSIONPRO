// Server/routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const { updateAdmissionStatus } = require("../controllers/collegeAdminController");
const admissionController = require("../controllers/admissionController");
const { protect } = require("../middlewares/authMiddleware");
const { getUserAdmissions ,approveAdmission} = require("../controllers/admissionController");
router.post("/", protect, admissionController.createAdmission);
router.get("/:admissionId/status", protect, admissionController.getAdmissionStatus);
router.get("/", protect, getUserAdmissions);
router.put("/:id/approve", protect, approveAdmission);
router.put("/:admissionId/status", protect, admissionController.updateAdmissionStatus);

module.exports = router;