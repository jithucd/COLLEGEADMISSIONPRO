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
  
  const response = await fetch(`${API_URL}/profile`, {
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

export const removeFromFavorites = async (courseId) => {
  const token = localStorage.getItem("token"); // ✅ Ensure token is retrieved
  if (!token) throw new Error("No token found. Please log in again.");

  try {
    const response = await fetch(`http://localhost:5000/api/users/favorites/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Ensure correct format
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token"); // ✅ Clear invalid token
      window.location.href = "/login"; // Redirect to login
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing favorite:", error.message);
    throw error;
  }
};