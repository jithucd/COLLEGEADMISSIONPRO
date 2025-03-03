import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Alert, Button } from "react-bootstrap";
import { getProfile, removeFromFavorites } from "../services/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  const handleApplyNow = (courseId) => {
    toast.info("Redirecting to admission page...", {
      autoClose: 2000,
      onClose: () => navigate(`/admission/${courseId}`),
    });
  };
  useEffect(() => {
    setIsClient(true);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this page");
          setLoading(false);
          return;
        }

        const data = await getProfile();
        setUserData(data);

        // ✅ Redirect if user is not a student
        if (data.role === "admin" || data.role === "college_admin") {
          navigate("/admin-dashboard"); // 🔹 Redirect to admin dashboard
        }
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!isClient) return null; // ✅ Prevents hydration error

  if (loading) {
    return (
      <Container className="py-5">
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // ✅ Render student dashboard only if role is "student"
  if (userData?.role !== "student") {
    return (
      <Container className="py-5">
        <Alert variant="warning">Access Denied: You are not a student.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1>Welcome, {userData?.name}!</h1>
      <p className="lead">Student Dashboard</p>

      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Your Profile</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {userData?.name}
                <br />
                <strong>Email:</strong> {userData?.email}
                <br />
                <strong>Role:</strong> {userData?.role || "Student"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Your Favorite Courses</Card.Title>
              {userData?.favorites?.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>College</th>
                      <th>Duration</th>
                      <th>Fees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.favorites.map((course) =>
                      course && course._id ? (
                        <tr key={course._id}>
                          <td>{course.title}</td>
                          <td>{course.college?.name || "N/A"}</td>
                          <td>{course.duration}</td>
                          <td>₹{course.fees?.toLocaleString() || "N/A"}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeFromFavorites(course._id)}
                            >
                              Remove
                            </Button>
                            <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApplyNow(course._id)}
                        >
                          Apply Now
                        </Button>
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </Table>
              ) : (
                <p>No favorite courses found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
