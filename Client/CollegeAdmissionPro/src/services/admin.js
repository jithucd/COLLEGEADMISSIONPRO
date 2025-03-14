// const API_URL = "http://localhost:5000/api";
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch users");
  }
};

export const getAllColleges = async (token) => {
  try {
    const response = await fetch(`${API_URL}/colleges`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch colleges");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch colleges");
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to delete user");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to delete user");
  }
};

export const createCollege = async (collegeData, token) => {
  try {
    console.log("📡 Sending API request to create college:", collegeData);
    
    const response = await fetch(`${API_URL}/colleges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(collegeData)
    });

    console.log("📡 API Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error Response:", errorData);
      throw new Error(errorData.error || "Failed to create college");
    }

    const result = await response.json();
    console.log("✅ College Created Successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
    throw new Error(error.message || "Failed to create college");
  }
};


export const approveCollege = async (collegeId) => {
  try {
    const response = await fetch(`${API_URL}/admin/colleges/${collegeId}/approve`, {
      method: "PUT"
    });

    if (!response.ok) throw new Error("Failed to approve college");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to approve college");
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) throw new Error("Failed to update user role");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update user role");
  }
};

export const getAdminStats = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, { method: "GET" });

    if (!response.ok) throw new Error("Failed to fetch admin statistics");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch admin statistics");
  }
};

// College Admin Services
export const getCollegeAdmissions = async () => {
  try {
    const response = await fetch(`${API_URL}/college-admin/admissions`, { method: "GET" });

    if (!response.ok) throw new Error("Failed to fetch college admissions");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch college admissions");
  }
};

export const updateAdmissionStatus = async (admissionId, status) => {
  try {
    const response = await fetch(`${API_URL}/college-admin/admissions/${admissionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error("Failed to update admission status");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update admission status");
  }
};

export const toggleCollegeStatus = async (collegeId, isActive, token) => {
  try {
    console.log("Toggling college status for:", collegeId, "Set active:", isActive);
    const response = await fetch(`${API_URL}/colleges/${collegeId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ active: isActive })
    });

    if (!response.ok) throw new Error("Failed to toggle college status");
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to toggle college status");
  }
};

export const toggleUserStatus = async (userId, isActive, token) => {
  try {
    console.log("Toggling user status for:", userId, "Set active:", isActive);

    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ active: isActive })
    });
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.error || "Failed to toggle user status");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to toggle user status");
  }
};
