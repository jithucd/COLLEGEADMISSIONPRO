import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
// const API_URL = import.meta.env.VITE_API_URL + "/api/auth";
export const signup = async (userData) => {
  console.log("Sending Signup Data:", userData);
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

// export const login = async (credentials) => {
//   try {
//     const response = await axios.post("http://localhost:5000/api/auth/login", credentials, {
//       withCredentials: true,  // Allow cookies (important for authentication)
//     });

//     if (response.data.token && response.data.user) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("userRole", response.data.user.role);
//     }

//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || "Login failed");
//   }
// };
export const login = async (credentials) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", credentials, {
     
      withCredentials: true,
     
    });

    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
    }

    return response.data;
  } catch (error) {
    let errorMessage = "Login failed";
    
    if (error.code === "ECONNABORTED") {
      errorMessage = "Connection timed out - check server status";
    } else if (!error.response) {
      errorMessage = "Network error - server unreachable";
    } else if (error.response.status === 429) {
      errorMessage = `${error.response.data.error} Retry in ${retrySeconds} seconds`;
    }else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    throw new Error(errorMessage);
  }
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  // We don't need to call the server endpoint since JWT is stateless
  // and we're just removing the token from local storage
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});