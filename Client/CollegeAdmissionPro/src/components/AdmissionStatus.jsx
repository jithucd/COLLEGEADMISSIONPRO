import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";

const AdmissionStatus = () => {
  const { admissionId } = useParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admissions/${admissionId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStatus(response.data.status);
      } catch (err) {
        setError("Failed to fetch admission status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [admissionId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2>Admission Status</h2>
      <Alert variant={status === "approved" ? "success" : status === "rejected" ? "danger" : "info"}>
        {status ? `Your admission is ${status}.` : "Pending approval."}
      </Alert>
    </Container>
  );
};

export default AdmissionStatus;
