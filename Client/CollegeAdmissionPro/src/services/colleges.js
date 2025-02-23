import axios from "axios";

const API_URL = "http://localhost:5000/api/colleges";

export const getAllColleges = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCollegeById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCollege = async (collegeData, token) => {
  const response = await axios.post(API_URL, collegeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};