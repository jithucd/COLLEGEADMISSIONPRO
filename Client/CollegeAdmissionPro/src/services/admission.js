// Client/CollegeAdmissionPro/src/services/admission.js
import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}`;
export const createAdmission = async (courseId, formData) => {
  const token = localStorage.getItem("token");

  // Log the data before sending
  console.log("Sending data:", { courseId, ...formData });

  try {
    const response = await axios.post(
      `${API_URL}/api/admissions`,
     
      { courseId, ...formData }, // Data payload
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return the admission data
  } catch (error) {
    console.error("Error creating admission:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to submit application.");
  }
};

  
  export const createPaymentOrder = async (admissionId, amount) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}/api/payments/create-order`,
        
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