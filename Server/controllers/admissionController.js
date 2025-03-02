// Server/controllers/admissionController.js
const Admission = require("../models/Admission");

exports.createAdmission = async (req, res) => {
  try {
    const admission = await Admission.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(admission);
  } catch (error) {
    res.status(500).json({ error: "Failed to create admission" });
  }
};

exports.getAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate("course college");
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admission status" });
  }
};