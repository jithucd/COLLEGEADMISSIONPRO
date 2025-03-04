import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Fetch all colleges
export const getAllColleges = async () => {
  try {
    const response = await axios.get(`${API_URL}/colleges`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch colleges");
  }
};

// Fetch a college by ID (Corrected)
export const getCollegeById = async (collegeId) => {
  if (!collegeId) throw new Error("College ID is required");

  try {
    const response = await axios.get(`${API_URL}/colleges/${collegeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch college details");
  }
};

// Create a new college
export const createCollege = async (collegeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/colleges`, collegeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create college");
  }
};

// Add a course to a college
export const addCourse = async (collegeId, courseData, token) => {
  if (!collegeId) throw new Error("College ID is required");
  
  try {
    const response = await axios.post(`${API_URL}/colleges/${collegeId}/courses`, courseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add course");
  }
};

// Fetch courses for a specific college
export const getCollegeCourses = async (collegeId) => {
  if (!collegeId) throw new Error("College ID is required");

  try {
    const response = await axios.get(`${API_URL}/colleges/${collegeId}/courses`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch courses");
  }
};

// Fetch college details (Corrected function)
export const fetchCollegeDetails = async (collegeId, setCollege) => {
  if (!collegeId) throw new Error("College ID is required");

  try {
    const { data } = await axios.get(`${API_URL}/colleges/${collegeId}`);
    setCollege(data);
  } catch (error) {
    console.error("Failed to fetch college details:", error);
  }
};
