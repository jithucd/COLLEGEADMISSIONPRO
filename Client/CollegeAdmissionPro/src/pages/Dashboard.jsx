import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Alert, Button, Spinner } from "react-bootstrap";
import { getProfile, removeFromFavorites } from "../services/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  const handleApplyNow = (courseId) => {
    if (!courseId) {
      toast.error("Invalid course ID. Please try again.");
      return;
    }
    navigate(`/admission/${courseId}`);
  };

  const handleRemoveFavorite = async (courseId) => {
    try {
      await removeFromFavorites(courseId);
      setUserData(prev => ({
        ...prev,
        favorites: prev.favorites.filter(course => course._id !== courseId)
      }));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove from favorites");
    }
  };

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this page");
          setLoading(false);
          return;
        }

        // Fetch user profile
        const userData = await getProfile();
        setUserData(userData);

        // Redirect non-students
        if (userData.role == "admin") {
          navigate("/admin-dashboard");
          return;
        }
        if (userData.role == "college_admin") {
          navigate("/college-admin-dashboard");
          return;
        }
        // Fetch admissions data
        const admissionsResponse = await axios.get("http://localhost:5000/api/admissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmissions(admissionsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err); // Log full error

        // ✅ Properly check if response exists
        if (err.response) {
          setError(err.response.data?.error || "Failed to load dashboard data");
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (!isClient) return null;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
          <Card className="mb-4">
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
                              onClick={() => handleRemoveFavorite(course._id)}
                              className="me-2"
                            >
                              Remove
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApplyNow(course._id)}
                              disabled={!course._id}
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

          <Card>
            <Card.Body>
              <Card.Title>Admission Status</Card.Title>
              {admissions.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>College</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.map((admission) => (
                      <tr key={admission._id}>
                        <td>{admission.course?.title || "N/A"}</td>
                        <td>{admission.college?.name || "N/A"}</td>
                        <td>
                          <Alert
                            variant={admission.status === "approved" ? "success" :
                              admission.status === "rejected" ? "danger" : "info"}
                            className="mb-0"
                          >
                            {admission.status}
                          </Alert>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No admission applications found.</p>
              )}
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;