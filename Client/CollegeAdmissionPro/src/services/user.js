import axios from "axios";
const API_URL = "http://localhost:5000/api/users";

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProfile = async (updateData, token) => {
  const response = await axios.put(`${API_URL}/profile`, updateData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
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