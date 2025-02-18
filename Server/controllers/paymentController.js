const Razorpay = require("razorpay");
const Admission = require("../models/Admission");
const razorpay = require("../config/razorpay");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// Create a payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { admissionId, amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${admissionId}`,
    };


    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment order" });
  }
};
