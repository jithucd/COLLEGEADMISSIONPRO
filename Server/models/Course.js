const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fees: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "2 years"
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);