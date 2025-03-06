import { useState, useEffect } from "react";
import { signup } from "../services/auth";
import { getAllColleges } from "../services/admin"; // ✅ Import function to fetch colleges
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [collegeId, setCollegeId] = useState(""); // ✅ Store selected college
  const [colleges, setColleges] = useState([]); // ✅ Store list of colleges
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch colleges when component loads
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await getAllColleges();
        setColleges(data);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("Failed to load colleges.");
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Include collegeId only if user selects "college_admin"
      const signupData = role === "college_admin" ? { name, email, password, role, collegeId } : { name, email, password, role };

      const response = await signup(signupData);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Signup</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="email" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="password" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="role" className="mt-2">
          <Form.Label>Role</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="college_admin">College Admin</option>
          </Form.Select>
        </Form.Group>

        {/* Show college dropdown only if role is "college_admin" */}
        {role === "college_admin" && (
          <Form.Group controlId="collegeId" className="mt-2">
            <Form.Label>Select College</Form.Label>
            <Form.Select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required>
              <option value="">Select a College</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Button variant="success" type="submit" className="mt-3">
          Signup
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
