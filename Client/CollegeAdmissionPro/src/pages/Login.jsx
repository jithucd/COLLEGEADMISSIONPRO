// import { useState, useEffect } from "react";
// import { login } from "../services/auth";
// import { useNavigate } from "react-router-dom";
// import { Form, Button, Container, Alert } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [retryAfter, setRetryAfter] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (error?.includes('Too many')) {
//       const timer = setInterval(() => {
//         setRetryAfter(prev => Math.max(0, prev - 1));
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [error]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
     

//       const response = await login({ email, password });
//       if (response?.token) {
//         localStorage.setItem("token", response.token);
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       if (error.message.includes('Network Error')) {
//         setError('Backend server is unavailable. Check if server is running.');
//       } else {
//         setError(error.message);
//       }
//     }   
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Login</h2>
//       {error && (
//         <Alert variant="danger">
//           {error} {retryAfter > 0 && `Retry in ${retryAfter} seconds`}
//         </Alert>
//       )}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//             disabled={retryAfter > 0}
//           />
//         </Form.Group>

//         <Form.Group controlId="password" className="mt-2">
//           <Form.Label>Password</Form.Label>
//           <Form.Control 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//             disabled={retryAfter > 0}
//           />
//         </Form.Group>

//         <Button 
//           variant="primary" 
//           type="submit" 
//           className="mt-3"
//           disabled={retryAfter > 0}
//         >
//           {retryAfter > 0 ? `Please wait... (${retryAfter})` : "Login"}
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default Login;
import { useState, useEffect } from "react";
import { login as apiLogin } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  useEffect(() => {
    if (error?.includes("Too many")) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
       // Use the renamed service function
       const response = await apiLogin({ email, password });
       if (response?.token) {
         // Use the context login to update state
         contextLogin(response.token, response.role); // Pass role from API response

      // Navigate to the dashboard
      navigate("/dashboard");
   }
   } catch (error) {
      if (error.message.includes("Network Error")) {
        setError("Backend server is unavailable. Check if server is running.");
      } else {
        setError(error.message);
      }
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
            onSubmit={handleSubmit} // Use handleSubmit here
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
                disabled={retryAfter > 0}
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "5px",
                  padding: "12px 15px",
                  transition: "border-color 0.3s ease",
                }}
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: "1.5rem" }}>
              <Form.Label>
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={retryAfter > 0}
                style={{
                  border: "2px solid #e9ecef",
                  borderRadius: "5px",
                  padding: "12px 15px",
                  transition: "border-color 0.3s ease",
                }}
              />
            </Form.Group>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                variant="primary"
                type="submit"
                style={{
                  backgroundColor: "#004a7c",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease",
                }}
                disabled={retryAfter > 0}
              >
                {retryAfter > 0 ? `Please wait... (${retryAfter})` : "Login"}
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