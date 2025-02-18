// server/routes/adminRoutes.js
const router = require("express").Router();
const { isAdmin } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

// Admin-only routes
router.get("/users", isAdmin, adminController.getAllUsers);
router.delete("/users/:id", isAdmin, adminController.deleteUser);
router.post("/colleges", isAdmin, adminController.createCollege);

module.exports = router;