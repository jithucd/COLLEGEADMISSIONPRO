const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(
  {
    admission: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true }, // Payment gateway ID
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);