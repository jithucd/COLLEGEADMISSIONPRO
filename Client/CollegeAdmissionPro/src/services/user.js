import axios from "axios";
const API_URL = "http://localhost:5000/api/users";

// export const getProfile = async () => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(`${API_URL}/me`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };

export const updateProfile = async (updateData, token) => {
  const response = await axios.put(`${API_URL}/profile`, updateData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};



export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  
  const response = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  
  return await response.json();
};


export const uploadProfilePicture = async (formData, token) => {
  const response = await axios.post(`${API_URL}/upload-profile-picture`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const removeFromFavorites = async (courseId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to remove from favorites");
  }
};