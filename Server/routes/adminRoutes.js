// server/routes/adminRoutes.js
const router = require("express").Router();
const express = require("express");
const {authenticate, isAdmin , isCollegeAdmin} = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const collegeAdminController = require("../controllers/collegeAdminController");
// Admin-only routes
router.get("/users",authenticate, isAdmin, adminController.getAllUsers);
router.delete("/users/:id", isAdmin, adminController.deleteUser);
router.post("/colleges", isAdmin, adminController.createCollege);
router.put('/colleges/:id/approve', authenticate, isAdmin, adminController.approveCollege);
router.put('/users/:id/role', authenticate, isAdmin, adminController.updateUserRole);
router.get('/stats', authenticate, isAdmin, adminController.getAdminStats);
router.get(
    '/college-admin/admissions',
    authenticate,        // First check authentication
    isCollegeAdmin,      // Then verify college admin role
    collegeAdminController.getAdmissions // Finally handle request
  );
router.get('/college-admin/admissions', authenticate, isCollegeAdmin, collegeAdminController.getAdmissions);
router.put('/college-admin/admissions/:id', authenticate, isCollegeAdmin, collegeAdminController.updateAdmissionStatus);
router.get("/colleges", authenticate, isAdmin, adminController.getAllColleges);

module.exports = router;