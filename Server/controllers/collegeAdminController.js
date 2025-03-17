// Server/controllers/collegeAdminController.js
const Admission = require("../models/Admission");
const College = require("../models/College");
const mongoose = require("mongoose");
const User = require("../models/User");
const sendMail = require("../utils/mailer");
const Course = require("../models/Course");
exports.getAdmissions = async (req, res) => {
  try {

    const college = await College.findOne({ admin: req.user.id });
    if (!college) return res.status(404).json({ error: "College not found" });
    
    // Get admissions for the college the admin is associated with
    const admissions = await Admission.find({ college: college._id })
  .populate({
    path: 'user',
    select: 'name email' // ✅ Include only necessary fields
  })
  .populate('course college')
  .populate({
    path: "user",
    select: "name email certificateUrl", // ✅ Directly populate certificateUrl
  });

      
    res.json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admissions" });
  }
};
// Server/controllers/collegeAdminController.js
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { admissionId } = req.params;
    const { status } = req.body;

    // Find admission and populate user and course details
    const admission = await Admission.findById(admissionId)
      .populate("user")
      .populate("course")
      .populate("college");

    if (!admission) {
      return res.status(404).json({ error: "Admission not found" });
    }

    // Update status
    admission.status = status;
    await admission.save();

    // ✅ Send email notification to student
    if (admission.user) {
      const emailSubject = `Your Admission Status for ${admission.course.title}`;
      const emailBody = `
        Dear ${admission.user.name},

        Your admission for the course "${admission.course.title}" at ${admission.college?.name || "the college"}
        has been ${status.toUpperCase()}.

        Thank you for applying. If you have any questions, please contact the college.

        Best regards,  
        ${admission.college?.name || "College Admin"}
      `;

      await sendMail(admission.user.email, emailSubject, emailBody);
    }

    res.status(200).json({ message: `Admission status updated to '${status}'` });
  } catch (err) {
    console.error("Error updating admission status:", err);
    res.status(500).json({ error: "Failed to update admission status" });
  }
};


  exports.getCollegeAdminData = async (req, res) => {
    try {
      console.log("Authenticated user:", req.user?.id);
      const adminId = new mongoose.Types.ObjectId(req.user.id);
      console.log("Converted adminId:", adminId);
      const college = await College.findOne({ admin: adminId })
     
        .populate('courses');
       
       
      if (!college) {
        console.log("College not found for adminId:", adminId);
        return res.status(404).json({ error: "College not found" });
      }
  
      res.json(college);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch college data" });
    }
  };

  // Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update course" });
  }
};
exports.getCollegeProof = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const collegeAdmin = await CollegeAdmin.findById(collegeId);
    
    if (!collegeAdmin || !collegeAdmin.proofUrl) {
      return res.status(404).json({ error: "Proof not found" });
    }

    res.status(200).json({ proofUrl: collegeAdmin.proofUrl });
  } catch (error) {
    console.error("Error fetching proof:", error);
    res.status(500).json({ error: "Failed to fetch proof" });
  }
};