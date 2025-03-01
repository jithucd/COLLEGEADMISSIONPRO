import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-4">
      <Container>
        <Row className="text-center">
          <Col>
            <p className="mb-0">&copy; 2025 College Management System</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
