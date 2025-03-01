const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create a payment order (authenticated users only)
router.post("/create-order", authenticate, paymentController.createPaymentOrder);
router.post("/verify-payment", authenticate, paymentController.verifyPaymentOrder);
module.exports = router;