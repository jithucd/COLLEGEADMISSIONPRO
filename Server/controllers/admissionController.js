import Admission from "../models/Admission.js";
import Course from "../models/Course.js";
export const createAdmission = async (req, res) => {
  try {
    
    const { courseId, fullName, email, phone, address } = req.body;
    const course = await Course.findById(courseId).populate("college");
    const userId = req.user._id; // Ensure protect middleware sets req.user
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    if (!course.college) {
      return res.status(400).json({ error: "College not found for this course" });
    }
    if (!courseId || !fullName || !email || !phone || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAdmission = new Admission({
      user: userId,
      college: course.college,
      course: courseId,
      fullName,
      email,
      phone,
      address,
      status: "pending",
    });

    await newAdmission.save();
    res.status(201).json({ success: true, message: "Admission request submitted!", admission: newAdmission });
  } catch (error) {
    console.error("Error submitting admission:", error);
    res.status(500).json({ error: "Server error while submitting admission." });
  }
};

export const getAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.admissionId)
      .populate("course college");
    res.json({ status: admission.status });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admission status" });
  }
};
export const updateAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, admission });
  } catch (err) {
    res.status(500).json({ error: "Failed to update admission" });
  }
};
export const getUserAdmissions = async (req, res) => {
  try {
    const userId = req.user._id;

    const admissions = await Admission.find({ user: userId })
      .populate("course", "title")
      .populate("college", "name");

    // if (!admissions.length) {
    //   return res.status(404).json({ error: "No admission records found" });
    // }

    res.json(admissions);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    res.status(500).json({ error: "Server error while fetching admissions" });
  }
};

export const approveAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ error: "Admission not found" });
    }

    // Only allow college admin to approve
    if (req.user.role !== "college_admin") {
      return res.status(403).json({ error: "Unauthorized: Only college admins can approve admissions." });
    }

    admission.status = "approved";
    await admission.save();

    res.json({ success: true, message: "Admission approved!", admission });
  } catch (error) {
    console.error("Error approving admission:", error);
    res.status(500).json({ error: "Server error while approving admission." });
  }
};