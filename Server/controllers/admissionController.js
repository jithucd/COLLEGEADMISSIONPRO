import Admission from "../models/Admission.js";
import Course from "../models/Course.js";
import sendMail from "../utils/mailer.js";
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

export const getUserAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.aggregate([
      {
        $lookup: {
          from: "users", // ✅ Join with User collection
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, // ✅ Flatten the user object
      {
        $lookup: {
          from: "colleges", // ✅ Join with College collection
          localField: "college",
          foreignField: "_id",
          as: "college"
        }
      },
      { $unwind: "$college" },
      {
        $lookup: {
          from: "courses", // ✅ Join with Course collection
          localField: "course",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 1,
          status: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.certificateUrl": 1, // ✅ Directly pull certificateUrl
          "college._id": 1,
          "college.name": 1,
          "college.proofUrl": 1,
          "course._id": 1,
          "course.title": 1
        }
      }
    ]);

    console.log("Aggregated Admissions:", admissions);

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