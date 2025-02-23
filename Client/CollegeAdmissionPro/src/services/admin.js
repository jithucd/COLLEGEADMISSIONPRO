import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getAllColleges = async () => {
  const response = await axios.get(`${API_URL}/colleges`);
  return response.data;
};