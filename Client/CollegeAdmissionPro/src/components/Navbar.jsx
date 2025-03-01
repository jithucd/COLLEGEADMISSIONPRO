import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // In a real app, you would decode the JWT to get user role
      // For now, we'll try to get it from localStorage if it exists
      const role = localStorage.getItem("userRole");
      if (role) setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">College Admission Pro</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/colleges">Colleges</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            
            {isLoggedIn ? (
              <>
                {userRole === "admin" && (
                  <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
                )}
                {userRole === "college_admin" && (
                  <Nav.Link as={Link} to="/college-admin-dashboard">College Dashboard</Nav.Link>
                )}
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;