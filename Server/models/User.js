const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin", "college_admin"],
      default: "student",
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    },
    active: { type: Boolean, default: true },
    certificateUrl: { type: String },
    profilePicture: {
       type: String,
       default: "/default-profile.jpg"
       }
   
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);