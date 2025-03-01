const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true
  },
  razorpay_payment_id: {
    type: String,
    required: true
  },
  razorpay_signature: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);