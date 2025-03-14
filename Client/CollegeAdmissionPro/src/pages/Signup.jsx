import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // ✅ Upload file to Cloudinary using fetch
  const handleUpload = async () => {
    if (!selectedFile) {
      throw new Error("Please select a file first");
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "college_docs"); // ✅ Your Cloudinary preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djx9ffzob/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Failed to upload file");
    }
  };

  // ✅ Handle signup request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let uploadedProofUrl = null;

      // ✅ Upload the file if user is a college admin
      if (role === "college_admin" && selectedFile) {
        uploadedProofUrl = await handleUpload();
      }

      // ✅ Clean up input data
      const signupData =
      role === "college_admin"
        ? {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role,
            college: {
              name: collegeName.trim(),
              location: collegeLocation.trim(),
              proof: uploadedProofUrl || null,
            },
          }
        : {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role,
            college: null,
          };
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        JSON.parse(JSON.stringify(signupData))
      ),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup Error Response:", errorData);
      throw new Error(errorData.message || "Signup failed");
    }
    

      const data = await response.json();
      console.log("Signup Success:", data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed");
    }
  };

  return (
    <Container fluid  style={{
      backgroundColor: "whitesmoke",
      backgroundImage: "url('/images/signup5.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "2rem 0",
    }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="college_admin">College Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {role === "college_admin" && (
              <>
                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>College Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>College Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={collegeLocation}
                    onChange={(e) => setCollegeLocation(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1.5rem" }}>
                  <Form.Label>Upload Proof</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} required />
                </Form.Group>
              </>
            )}

            <Button type="submit" className="mt-3 w-100">
              Create Account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
