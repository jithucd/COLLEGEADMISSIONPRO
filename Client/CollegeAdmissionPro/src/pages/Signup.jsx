import { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signup({ name, email, password, role });
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
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3">
          Signup
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;

