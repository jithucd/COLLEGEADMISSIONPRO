import axios from "axios";

const API_URL = "http://localhost:5000/api/colleges";

export const getAllColleges = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch colleges");
  }
};

export const getCollegeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch college details");
  }
};

export const createCollege = async (collegeData, token) => {
  try {
    const response = await axios.post(API_URL, collegeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create college");
  }
};

export const addCourse = async (collegeId, courseData, token) => {
  try {
    const response = await axios.post(`${API_URL}/${collegeId}/courses`, courseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add course");
  }
};
