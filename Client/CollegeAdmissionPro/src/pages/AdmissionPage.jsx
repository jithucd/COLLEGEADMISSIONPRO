import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { createAdmission, createPaymentOrder } from '../services/admission';
import Loader from '../components/Loader';

const AdmissionPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    // Load from environment variables
    setRazorpayKey(import.meta.env.REACT_APP_RAZORPAY_KEY_ID);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to proceed with admission.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create admission
      const admission = await createAdmission(courseId, formData);

      // 2. Create payment order
      const order = await createPaymentOrder(admission._id, admission.course.fees);

      // 3. Initialize Razorpay
      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID, // Directly use env var
        amount: order.amount,
        currency: "INR",
        name: "College Admission Pro",
        description: "Course Admission Fee",
        order_id: order.id,
        handler: (response) => {
          navigate(`/admission/${admission._id}/status`);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
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
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Proceed to Payment'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdmissionPage;