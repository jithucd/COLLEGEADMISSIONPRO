import { useState, useEffect } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (error?.includes('Too many')) {
      const timer = setInterval(() => {
        setRetryAfter(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     

      const response = await login({ email, password });
      if (response?.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setError('Backend server is unavailable. Check if server is running.');
      } else {
        setError(error.message);
      }
    }   
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      {error && (
        <Alert variant="danger">
          {error} {retryAfter > 0 && `Retry in ${retryAfter} seconds`}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={retryAfter > 0}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={retryAfter > 0}
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="mt-3"
          disabled={retryAfter > 0}
        >
          {retryAfter > 0 ? `Please wait... (${retryAfter})` : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;