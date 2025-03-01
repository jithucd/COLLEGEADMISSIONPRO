// Client/CollegeAdmissionPro/src/services/collegeAdmin.js
import axios from "axios";

export const getCollegeAdmissions = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("/api/college-admin/admissions", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateAdmissionStatus = async (admissionId, status) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `/api/college-admin/admissions/${admissionId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const manageCourse = async (courseId, action) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(`/api/courses/${courseId}`,
    { action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
export const getCollegeAdminData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("/api/college-admin", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};