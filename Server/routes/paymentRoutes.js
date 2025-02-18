const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");


// Create a payment order (authenticated users only)
router.post("/create-order", authenticate, paymentController.createPaymentOrder);

module.exports = router;