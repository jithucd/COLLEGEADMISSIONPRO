import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch users");
  }
};

export const getAllColleges = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/colleges`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch colleges");
  }
};

// export const updateUserRole = async (userId, newRole, token) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/users/${userId}/role`,
//       { role: newRole },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || "Failed to update user role");
//   }
// };

// export const approveCollege = async (collegeId, token) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/colleges/${collegeId}/approve`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || "Failed to approve college");
//   }
// };

export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete user");
  }
};

// export const getAdminStats = async (token) => {
//   try {
//     const response = await axios.get(`${API_URL}/stats`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || "Failed to fetch admin statistics");
//   }
// };
export const createCollege = async (collegeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/colleges`, collegeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create college");
  }
};
export const approveCollege = async (collegeId) => {
  const response = await axios.put(`/api/admin/colleges/${collegeId}/approve`);
  return response.data;
};

export const updateUserRole = async (userId, newRole) => {
  const response = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axios.get('/api/admin/stats');
  return response.data;
};

// College Admin Services
export const getCollegeAdmissions = async () => {
  const response = await axios.get('/api/college-admin/admissions');
  return response.data;
};

export const updateAdmissionStatus = async (admissionId, status) => {
  const response = await axios.put(`/api/college-admin/admissions/${admissionId}`, { status });
  return response.data;
};