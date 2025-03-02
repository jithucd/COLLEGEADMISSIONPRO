// Server/controllers/collegeAdminController.js
const Admission = require("../models/Admission");

exports.getAdmissions = async (req, res) => {
  try {

    const college = await College.findOne({ admin: req.user.id });
    if (!college) return res.status(404).json({ error: "College not found" });
    
    // Get admissions for the college the admin is associated with
    const admissions = await Admission.find({ college: req.user.college })
      .populate('user course college');
      
    res.json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admissions" });
  }
};
// Server/controllers/collegeAdminController.js
exports.updateAdmissionStatus = async (req, res) => {
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