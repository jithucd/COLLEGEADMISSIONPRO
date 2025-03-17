// Client/CollegeAdmissionPro/src/services/collegeAdmin.js

// const API_URL = "http://localhost:5000/api";
const API_URL = `${import.meta.env.VITE_API_URL}/api`;
import axios from 'axios';

export const getCollegeAdmissions = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/college-admin/admissions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch college admissions");
    }

    const data = await response.json();
    console.log("API Response:", data); 
  
    
    return data.map(admission => ({
      ...admission,
      certificateUrl: admission.user?.certificateUrl || null, // ✅ Assign certificateUrl correctly
    }));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch college admissions");
  }
};


export const updateAdmissionStatus = async (admissionId, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/admissions/${admissionId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error("Failed to update admission status");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to update admission status");
  }
};

export const manageCourse = async (courseId, action) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    });
    if (!response.ok) {
      throw new Error("Failed to manage course");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to manage course");
  }
};

export const getCollegeAdminData = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/college-admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch college admin data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch college admin data");
  }
};
// Delete a course
export const deleteCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/college-admin/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete course");
  }

  return response.json();
};

// Update a course
export const updateCourse = async (courseId, updatedCourse) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/college-admin/courses/${courseId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCourse),
  });

  if (!response.ok) {
    throw new Error("Failed to update course");
  }

  return response.json();
};

export const updateCollegeDetails = async (collegeId, updatedData, token) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/colleges/${collegeId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};

