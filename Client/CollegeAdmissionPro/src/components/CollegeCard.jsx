import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CollegeCard = ({ college }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{college.name}</Card.Title>
        <Card.Text>
          <strong>Location:</strong> {college.location} <br />
          {college.description}
        </Card.Text>
        <Link to={`/colleges/${college._id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CollegeCard;