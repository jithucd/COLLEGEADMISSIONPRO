// import { useState, useEffect } from "react";
// import { signup } from "../services/auth";
// import { getAllColleges } from "../services/admin"; // ✅ Import function to fetch colleges
// import { useNavigate } from "react-router-dom";
// import { Form, Button, Container, Alert } from "react-bootstrap";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");
//   const [collegeId, setCollegeId] = useState(""); // ✅ Store selected college
//   const [colleges, setColleges] = useState([]); // ✅ Store list of colleges
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch colleges when component loads
//   useEffect(() => {
//     const fetchColleges = async () => {
//       try {
//         const data = await getAllColleges();
//         setColleges(data);
//       } catch (err) {
//         console.error("Error fetching colleges:", err);
//         setError("Failed to load colleges.");
//       }
//     };
//     fetchColleges();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // Include collegeId only if user selects "college_admin"
//       const signupData = role === "college_admin" ? { name, email, password, role, collegeId } : { name, email, password, role };

//       const response = await signup(signupData);
//       localStorage.setItem("token", response.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Signup</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="name">
//           <Form.Label>Name</Form.Label>
//           <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//         </Form.Group>

//         <Form.Group controlId="email" className="mt-2">
//           <Form.Label>Email</Form.Label>
//           <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </Form.Group>

//         <Form.Group controlId="password" className="mt-2">
//           <Form.Label>Password</Form.Label>
//           <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </Form.Group>

//         <Form.Group controlId="role" className="mt-2">
//           <Form.Label>Role</Form.Label>
//           <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
//             <option value="student">Student</option>
//             <option value="college_admin">College Admin</option>
//           </Form.Select>
//         </Form.Group>

//         {/* Show college dropdown only if role is "college_admin" */}
//         {role === "college_admin" && (
//           <Form.Group controlId="collegeId" className="mt-2">
//             <Form.Label>Select College</Form.Label>
//             <Form.Select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required>
//               <option value="">Select a College</option>
//               {colleges.map((college) => (
//                 <option key={college._id} value={college._id}>
//                   {college.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         )}

//         <Button variant="success" type="submit" className="mt-3">
//           Signup
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default Signup;
import { useState, useEffect } from "react";
import { signup } from "../services/auth";
import { getAllColleges } from "../services/admin";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const signupData =
        role === "college_admin"
          ? { name, email, password, role, collegeId }
          : { name, email, password, role };

      const response = await signup(signupData);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor:"whitesmoke",
        backgroundImage: "url('/signup5.jfif')",
        backgroundRepeat: "no-repeat", // Prevents the image from repeating
        backgroundSize: "cover", // Ensures the image covers the entire element
        backgroundPosition: "center", // Centers the image
        width: "100%",
        height: "300px",
      
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      {/* <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          padding: "2rem 0",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="/manipal-logo.png"
          alt="Manipal Logo"
          style={{ height: "80px" }}
        />
        <h1 style={{ marginTop: "1rem", color: "#004a7c" }}>
          Create Your Account
        </h1>
      </div> */}

      <Row className="justify-content-center"  >
        <Col md={8} lg={6}>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
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
            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>
                    Full Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "5px",
                      padding: "12px 15px",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "5px",
                      padding: "12px 15px",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>
                    Password <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "5px",
                      padding: "12px 15px",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>
                    Role <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "5px",
                      padding: "12px 15px",
                      transition: "border-color 0.3s ease",
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="college_admin">College Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {role === "college_admin" && (
              <Form.Group style={{ marginBottom: "1.5rem" }}>
                <Form.Label>
                  Select College <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  required
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "5px",
                    padding: "12px 15px",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <option value="">Select your college</option>
                  {colleges.map((college) => (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#004a7c",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease",
                }}
              >
                Create Account
              </Button>
            </div>

            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#004a7c",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Login here
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;