import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button, Spinner } from "react-bootstrap";
import { getCollegeById } from "../services/colleges";
import CourseCard from "../components/CourseCard";

const CollegeDetail = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        console.log("Fetching college details for ID:", id);

        if (!id) {
          setError("Invalid College ID");
          setLoading(false);
          return;
        }

        const response = await getCollegeById(id);
        console.log("API Response:", response);

        if (!response || response.error) {
          throw new Error(response?.error || "College not found");
        }

        setCollege(response);
      } catch (err) {
        console.error("Error fetching college:", err);
        setError(err.message || "Failed to load college details");
      } finally {
        setLoading(false); // ✅ Ensure loading stops even on error
      }
    };

    fetchCollege();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    
    <Container className="my-4">
      {/* ✅ Show placeholder if no image */}
      <div className="mb-4">
        <img
          src={college?.imageUrl || "/placeholder.jpg"}
          alt={college?.name || "College Image"}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
          onError={(e) => (e.target.src = "/placeholder.jpg")} // Handle broken image links
        />
      </div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h1">{college?.name || "College Name Not Available"}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {college?.location || "Location not available"}
          </Card.Subtitle>
          <Card.Text>
            {college?.description || "Description not available"}
          </Card.Text>
        </Card.Body>
      </Card>

      

      <h2 className="mb-3">Available Courses</h2>

      {Array.isArray(college?.courses) && college.courses.length > 0 ? (
        <Row>
          {college.courses.map((course) => (
            <Col md={6} key={course._id}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="alert alert-info">No courses available at this college yet.</div>
      )}
    </Container>
  );
};

export default CollegeDetail;
