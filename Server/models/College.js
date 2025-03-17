const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String }, // College logo or image
    proofUrl: { type: String }, // ✅ New field for storing uploaded proof document
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // College admin
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);
// ✅ Populate admin name when fetching data
collegeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'admin',
    select: 'name' // ✅ Select only admin name
  });
  next();
});

module.exports = mongoose.model("College", collegeSchema);
