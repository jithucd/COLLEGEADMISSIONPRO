import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as apiLogin } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { login } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error?.includes("Too many")) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiLogin({ email, password });
      if (response?.token) {
        dispatch(login({ token: response.token, userRole: response.user.role }));
        localStorage.setItem("token", response.token); // Persist token
        localStorage.setItem("userRole", response.user.role); // Persist role
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setError("Backend server is unavailable. Check if server is running.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: "whitesmoke",
        backgroundImage: "url('/images/signup5.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {error && (
            <Alert variant="danger" className="text-center">
              {error} {retryAfter > 0 && `Retry in ${retryAfter} seconds`}
            </Alert>
          )}

          <Form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            <h2 className="text-center mb-4">Login</h2>

            <Form.Group style={{ marginBottom: "1.5rem" }}>
              <Form.Label>
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={retryAfter > 0 || isLoading}
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "5px",
                  padding: "12px 15px",
                  transition: "border-color 0.3s ease",
                }}
                aria-label="Email"
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: "1.5rem" }}>
              <Form.Label>
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={retryAfter > 0 || isLoading}
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "5px",
                    padding: "12px 15px",
                    transition: "border-color 0.3s ease",
                  }}
                  aria-label="Password"
                />
                <Button
                  variant="link"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Button>
              </div>
            </Form.Group>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                variant="primary"
                type="submit"
                disabled={retryAfter > 0 || isLoading}
                style={{
                  backgroundColor: "#004a7c",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease",
                }}
              >
                {isLoading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : retryAfter > 0 ? (
                  `Please wait... (${retryAfter})`
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Don't have an account?{" "}
              <a
                href="/signup"
                style={{
                  color: "#004a7c",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign up here
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;