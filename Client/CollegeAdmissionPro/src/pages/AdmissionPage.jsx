import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { createAdmission } from '../services/admission';
import Loader from '../components/Loader';

const AdmissionPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // useEffect(() => {
  //   setRazorpayKey(process.env.REACT_APP_RAZORPAY_KEY_ID);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("Please login to proceed with admission.");
      return;
    }
  
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError("All fields are required.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      console.log("Submitting Admission for Course ID:", courseId);
  
      const admission = await createAdmission(courseId, formData);
      console.log("Admission submitted:", admission);
  
      // Show success alert
      alert("Application sent successfully!");
  
      // Navigate to the Dashboard's Application Status after a short delay
      setTimeout(() => {
        navigate("/dashboard"); // Change this to the correct route
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <Container className="my-5">
      <Card className="p-4">
        <h2>Admission Application</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit Application"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdmissionPage;
