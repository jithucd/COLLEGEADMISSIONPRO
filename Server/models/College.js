const mongoose = require("mongoose");


const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // College admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);