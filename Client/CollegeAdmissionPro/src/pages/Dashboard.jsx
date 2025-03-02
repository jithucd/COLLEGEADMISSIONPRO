import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert, Button } from "react-bootstrap";
import { getProfile, removeFromFavorites } from "../services/user";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this page");
          return;
        }

        const data = await getProfile();
        setUserData(data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle removing a course from favorites
  const handleRemoveFavorite = async (courseId) => {
    if (!courseId) {
      setError("Invalid course ID");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await removeFromFavorites(courseId, token);

      // Update local state to remove the course from favorites
      setUserData((prev) => ({
        ...prev,
        favorites: prev?.favorites?.filter((course) => course._id !== courseId) || [],
      }));
    } catch (err) {
      setError("Failed to remove from favorites");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="py-5">
        <p>Loading...</p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1>Welcome, {userData?.name}!</h1>
      <p className="lead">{userData?.role} Dashboard</p>

      <Row className="mt-4">
        {/* Profile Section */}
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

        {/* Favorites Section */}
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
                    {userData.favorites
                      ?.filter(Boolean) // Ensure no null/undefined entries
                      .map((course) => (
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
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              ) : (
                <p>You haven't added any courses to your favorites yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
