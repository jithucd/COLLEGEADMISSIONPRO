import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

export const getAllCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addToFavorites = async (courseId, token) => {
  const response = await axios.post(
    `${API_URL}/favorites`,
    { courseId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};