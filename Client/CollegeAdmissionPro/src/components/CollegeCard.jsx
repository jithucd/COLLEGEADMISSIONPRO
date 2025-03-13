// import { Card, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { FiMapPin ,FiArrowRight } from 'react-icons/fi';

// const CollegeCard = ({ college }) => {
//   return (
//     // <Card className="mb-3">
//     //   <Card.Body>
//     //     <Card.Title>{college.name}</Card.Title>
//     //     <Card.Text>
//     //       <strong>Location:</strong> {college.location} <br />
//     //       {college.description}
//     //     </Card.Text>
//     //     <Link to={`/colleges/${college._id}`}>
//     //       <Button variant="primary">View Details</Button>
//     //     </Link>
//     //   </Card.Body>
//     // </Card>
//     // Add hover effect and better spacing
// <Card className="mb-3 shadow-sm hover-shadow transition-all">
//   <Card.Body className="pb-0">
//     <Card.Title className="fs-4 text-primary">{college.name}</Card.Title>
//     <div className="d-flex align-items-center mb-3">
//       <FiMapPin className="me-2 text-muted" />
//       <small className="text-muted">{college.location}</small>
//     </div>
//     <Card.Text className="text-secondary">{college.description}</Card.Text>
//     <Button 
//       variant="outline-primary" 
//       className="rounded-pill px-4 mb-3"
//       as={Link} 
//       to={`/colleges/${college._id}`}
//     >
//       Explore Programs <FiArrowRight className="ms-2" />
//     </Button>
//   </Card.Body>
// </Card>
//   );
// };

// export default CollegeCard;
import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

const CollegeCard = ({ college, isLoading }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  if (isLoading) {
    // ✅ Shimmer Effect for Loading State
    return (
      <Card style={styles.card} className="loading-card">
        <div className="shimmer"></div>
      </Card>
    );
  }

  return (
    <Card style={styles.card} className="fade-in">
      <Card.Body style={styles.cardBody}>
        {/* Title */}
        <Card.Title style={styles.title}>{college.name}</Card.Title>

        {/* Location */}
        <div style={styles.location}>
          <FiMapPin style={styles.icon} />
          <small>{college.location}</small>
        </div>

        {/* Description */}
        <Card.Text
          style={{
            ...styles.description,
            overflow: showFullDescription ? "visible" : "hidden",
            display: showFullDescription ? "block" : "-webkit-box",
            WebkitLineClamp: showFullDescription ? "unset" : 2, // ✅ Limit to 2 lines
            WebkitBoxOrient: "vertical",
          }}
        >
          {college.description}
        </Card.Text>

        {/* Read More */}
        {college.description.length > 100 && (
          <Button
            variant="link"
            size="sm"
            style={styles.readMore}
            onClick={toggleDescription}
          >
            {showFullDescription ? "Read Less" : "Read More"}
          </Button>
        )}

        {/* Explore Programs Button */}
        <Button
          style={styles.button}
          as={Link}
          to={`/colleges/${college._id}`}
        >
          Explore Programs <FiArrowRight style={styles.arrow} />
        </Button>
      </Card.Body>
    </Card>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.15)", // ✅ 3D shadow
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    overflow: "hidden",
    minHeight: "250px", // ✅ Fixed height for equal size
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    '&:hover': {
      transform: "translateY(-6px)", // ✅ Lift effect on hover
      boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
    },
  },
  cardBody: {
    padding: "10px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  location: {
    display: "flex",
    alignItems: "center",
    color: "#7f8c8d",
    marginBottom: "12px",
  },
  icon: {
    marginRight: "8px",
    color: "#3498db",
  },
  description: {
    fontSize: "0.95rem",
    color: "#6c757d",
    marginBottom: "12px",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2, // ✅ Limit to 2 lines
  },
  readMore: {
    padding: "0",
    margin: "0",
    color: "#3498db",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    borderRadius: "30px",
    padding: "8px 20px",
    fontSize: "0.9rem",
    border: "none",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    '&:hover': {
      backgroundColor: "#2980b9",
    },
  },
  arrow: {
    marginLeft: "6px",
  },
};

export default CollegeCard;
