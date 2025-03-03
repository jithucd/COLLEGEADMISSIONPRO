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
        const { id } = useParams(); // ✅ Ensure ID comes from route params
        if (!id) {
          setError("Invalid College ID");
          return;
        }
    
        const response = await getCollegeById(id);
        if (!response) throw new Error("College not found");
    
        setCollege(response);
      } catch (error) {
        setError(error.message);
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
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h1">{college?.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{college?.location}</Card.Subtitle>
          <Card.Text>{college?.description}</Card.Text>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Available Courses</h2>
      
      {college?.courses?.length > 0 ? (
        <Row>
          {college.courses.map(course => (
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
