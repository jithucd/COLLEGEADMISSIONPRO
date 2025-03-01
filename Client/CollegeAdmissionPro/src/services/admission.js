// Client/CollegeAdmissionPro/src/services/admission.js
import axios from "axios";

export const createAdmission = async (courseId, formData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/admissions",
        { courseId, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create admission");
    }
  };
  
  export const createPaymentOrder = async (admissionId, amount) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/payments/create-order",
        { admissionId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create payment order");
    }
  };

  export const getAdmissionStatus = async (admissionId) => {
    try {
      const response = await axios.get(`${API_URL}/${admissionId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch admission status");
    }
  };