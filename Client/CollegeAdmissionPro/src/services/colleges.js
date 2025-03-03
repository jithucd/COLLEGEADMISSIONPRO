import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getAllColleges = async () => {
  try {
    const response = await axios.get("http://localhost:5000/admin/colleges");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch colleges");
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" }); // ✅ Send correct error message
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCollege = async (collegeData, token) => {
  try {
    const response = await axios.post("/colleges", collegeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create college");
  }
};

export const addCourse = async (collegeId, courseData, token) => {
  if (!collegeId) throw new Error("College ID is required");
  try {
    const response = await axios.post(`/colleges/${collegeId}/courses`, courseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add course");
  }
};
export const getCollegeCourses= async (collegeId) => {
  if (!collegeId) throw new Error("College ID is required");
  
  try {
    const response = await api.get(`/colleges/${collegeId}/courses`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch courses");
  }
};
