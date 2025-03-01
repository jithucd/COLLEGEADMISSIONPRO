import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch courses");
  }
};

export const addToFavorites = async (courseId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/favorites`,
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add to favorites");
  }
};
