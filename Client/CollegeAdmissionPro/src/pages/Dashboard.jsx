import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Alert, Button, Spinner } from "react-bootstrap";
import { getProfile, removeFromFavorites } from "/src/services/user.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.userRole);

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
      setUserData((prev) => ({
        ...prev,
        favorites: prev.favorites.filter((course) => course._id !== courseId),
      }));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove from favorites");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this page");
          setLoading(false);
          return;
        }

        const userData = await getProfile();
        setUserData({
          ...userData,
          collegeId: userData.collegeId?._id || null,
        });

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/admissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredAdmissions = response.data.filter((admission) => {
          if (userRole === "student") {
            return String(admission.user?._id) === String(userData._id);
          } else if (userRole === "college-admin" && admission.college && userData.collegeId) {
            return String(admission.college?._id) === String(userData.collegeId);
          }
          return false;
        });

        setAdmissions(filteredAdmissions);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userRole]);

  useEffect(() => {
    if (!loading && userRole) {
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "college_admin") {
        navigate("/college-admin-dashboard");
      } else if (userRole !== "student") {
        setError("Access Denied: Only students can view this dashboard");
      }
    }
  }, [userData, navigate, loading, userRole]);

  if (loading) {
    return (
      <Container style={styles.centered}>
        <Spinner animation="border" role="status" style={styles.spinner}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={styles.centered}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={styles.container}>
      <h1 style={styles.header}>Welcome, {userData?.name}!</h1>
      <p style={styles.subHeader}>Student Dashboard</p>

      <Row className="mt-4">
        <Col md={12}>
          <Card style={styles.card}>
            <Card.Body>
              <Card.Title style={styles.cardTitle}>Your Favorite Courses</Card.Title>
              {userData?.favorites?.length > 0 ? (
                <Table responsive hover style={styles.table}>
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
                    {userData.favorites.map((course) => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>{course.college?.name || "N/A"}</td>
                        <td>{course.duration}</td>
                        <td>₹{course.fees?.toLocaleString() || "N/A"}</td>
                        <td>
                          <Button
                            style={styles.removeButton}
                            size="sm"
                            onClick={() => handleRemoveFavorite(course._id)}
                          >
                            Remove
                          </Button>
                          <Button
                            style={styles.applyButton}
                            size="sm"
                            onClick={() => handleApplyNow(course._id)}
                          >
                            Apply Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No favorite courses found.</p>
              )}
            </Card.Body>
          </Card>

          <Card style={styles.card}>
            <Card.Body>
              <Card.Title style={styles.cardTitle}>Admission Status</Card.Title>
              {admissions.length > 0 ? (
                <Table responsive striped hover style={styles.table}>
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
                            variant={
                              admission.status === "approved"
                                ? "success"
                                : admission.status === "rejected"
                                  ? "danger"
                                  : "info"
                            }
                          >
                            {admission.status}
                          </Alert>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No admissions found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafc",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "white",
  },
  subHeader: {
    fontSize: "1.2rem",
    color: "white",
  },
  card: {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "none",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "500",
  },
  table: {
    fontSize: "0.95rem",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    marginRight: "5px",
    border: "none",
    borderRadius: "6px",
  },
  applyButton: {
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  spinner: {
    color: "#007bff",
  },
  centered: {
    textAlign: "center",
    paddingTop: "50px",
  },
};

export default Dashboard;