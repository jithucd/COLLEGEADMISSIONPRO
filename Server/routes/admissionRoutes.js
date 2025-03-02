// Server/routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const admissionController = require("../controllers/admissionController");

router.post("/", authenticate, admissionController.createAdmission);
router.get("/:id/status", authenticate, admissionController.getAdmissionStatus);

module.exports = router;