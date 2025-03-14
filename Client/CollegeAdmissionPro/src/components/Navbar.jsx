import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUniversity, FaBook, FaUserCircle, FaTachometerAlt } from "react-icons/fa";
import styled from "styled-components";
import { useAuth, ROLES } from "../context/AuthContext";

const StyledNavbar = styled(Navbar)`
  background-color: #001a3a;
  border-bottom: 3px solid #ffb300;
  padding: 0.5rem 0;

  .navbar-brand {
    color: white !important;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Roboto', sans-serif;
  }

  .nav-link {
    color: white !important;
    font-weight: 500;
    position: relative;
    padding: 8px 0 !important;
    transition: all 0.3s ease !important;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      color: #ffb300 !important;
      transform: translateY(-2px);
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #ffb300;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
   
  }
`;

const NavigationBar = () => {
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();
  console.log("Navbar - isLoggedIn:", isLoggedIn);
  console.log("Navbar - userRole:", userRole);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <StyledNavbar collapseOnSelect expand="lg">
      <Container fluid style={{ maxWidth: "1200px", padding: "0 20px" }}>
        <Navbar.Brand as={Link} to="/">
          <FaUniversity style={{ fontSize: "1.8rem" }} />
          Services Management System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" style={{ gap: "1.5rem", alignItems: "center" }}>
            <Nav.Link as={Link} to="/colleges">
              <FaUniversity />
              Colleges
            </Nav.Link>
            
            <Nav.Link as={Link} to="/courses">
              <FaBook />
              Courses
            </Nav.Link>

            {/* ✅ Directly use context state */}
            {isLoggedIn && userRole === ROLES.ADMIN && (
              <Nav.Link as={Link} to="/admin-dashboard">
                <FaTachometerAlt />
                Admin Dashboard
              </Nav.Link>
            )}
            {isLoggedIn && userRole === ROLES.COLLEGE_ADMIN && (
              <Nav.Link as={Link} to="/college-admin-dashboard">
                <FaTachometerAlt />
                College Dashboard
              </Nav.Link>
            )}
            {isLoggedIn && userRole === ROLES.STUDENT && (
              <Nav.Link as={Link} to="/dashboard">
                <FaTachometerAlt />
                Student Dashboard
              </Nav.Link>
            )}

            {isLoggedIn ? (
              <NavDropdown
                title={<FaUserCircle style={{ fontSize: "1.5rem" }} />}
                id="collapsible-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default NavigationBar;
