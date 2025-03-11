import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { addCourse } from "../services/colleges";

const AddCourse = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fees: "",
    duration: "",
    collegeId:collegeId,
    
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await addCourse(collegeId, {
        ...formData,
        collegeId,
        fees: parseFloat(formData.fees)
      }, token);
      alert("Course added successfully!");
      navigate(`/colleges/${collegeId}/courses`);
    } catch (err) {
      setError(err.message || "Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h1>Add New Course</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Course Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Fees (₹)</Form.Label>
          <Form.Control
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            min="0"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 2 years, 6 months"
            required
          />
        </Form.Group>
        
        <div className="d-flex gap-2">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Course"}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddCourse;