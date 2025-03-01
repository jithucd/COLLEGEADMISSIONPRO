import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";
import { getProfile } from "/src/services/user.js";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this page");
          return;
        }
        
        const data = await getProfile(); // Remove the token argument
        setUserData(data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Container className="py-5"><p>Loading...</p></Container>;
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1>Student Dashboard</h1>
      <p className="lead">Welcome, {userData?.name}!</p>

      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Your Profile</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {userData?.name}<br />
                <strong>Email:</strong> {userData?.email}<br />
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
                    </tr>
                  </thead>
                  <tbody>
                    {userData.favorites.map(course => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>{course.college?.name}</td>
                        <td>{course.duration}</td>
                        <td>₹{course.fees}</td>
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