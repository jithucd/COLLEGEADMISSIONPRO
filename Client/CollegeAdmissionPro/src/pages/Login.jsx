import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response?.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      setError(error.message || "Login failed!");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="password" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
