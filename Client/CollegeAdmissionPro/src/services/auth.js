import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    
    // Store user role in localStorage for easy access
    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Signup failed");
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    // Store user role in localStorage for easy access
    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  // We don't need to call the server endpoint since JWT is stateless
  // and we're just removing the token from local storage
};