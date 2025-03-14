import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;
// const API_URL = "http://localhost:5000/api/users";

export const updateProfile = async (updateData) => {
  const token = localStorage.getItem("token"); // ✅ Retrieve token

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  try {
    const response = await axios.put(`${API_URL}/profile`, updateData, {
      headers: { 
        Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Profile update failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to update profile");
  }
};



export const getProfile = async () => {
  const token = localStorage.getItem("token"); // ✅ Get token from localStorage
  if (!token) throw new Error("No authentication token found. Please log in.");

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { 
        Authorization: `Bearer ${token}`, // ✅ Send token
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Profile fetch failed:", error.response?.data || error.message);

    // Handle 401 Unauthorized - Logout user if token is invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
      throw new Error("Session expired. Please log in again.");
    }

    throw new Error(error.response?.data?.error || "Failed to fetch profile");
  }
};


export const uploadProfilePicture = async (formData) => {
  const token = localStorage.getItem("token"); // ✅ Get token directly from localStorage

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Send token in the header
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const removeFromFavorites = async (courseId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in again.");

  try {
    const response = await axios.delete(`${API_URL}/favorites/${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
      throw new Error("Session expired. Please log in again.");
    }
    console.error("Error removing favorite:", error.message);
    throw error;
  }
};