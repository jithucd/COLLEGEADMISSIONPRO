import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const dashboardRoutes = {
  admin: "/admin-dashboard",
  college_admin: "/college-admin-dashboard",
  student: "/dashboard",
};

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      style={{
        background: "linear-gradient(to right, #FF7F50, #1E3A8A)", // Light orange and navy blue gradient
      }}
      variant="dark"
      expand="lg"
      className="py-3"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          Services Management System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* ✅ Always visible */}
            <Nav.Link as={Link} to="/colleges" className="text-white">
              Colleges
            </Nav.Link>
            <Nav.Link as={Link} to="/courses" className="text-white">
              Courses
            </Nav.Link>

            {/* ✅ Single logic for Dashboard */}
            {isLoggedIn && dashboardRoutes[userRole] && (
              <Nav.Link as={Link} to={dashboardRoutes[userRole]} className="text-white">
                Dashboard
              </Nav.Link>
            )}

            {/* ✅ Profile + Logout in Dropdown */}
            {isLoggedIn ? (
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-white">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
