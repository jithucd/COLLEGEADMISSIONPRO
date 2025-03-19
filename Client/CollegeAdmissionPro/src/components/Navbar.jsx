import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const dashboardRoutes = {
  admin: "/admin-dashboard",
  college_admin: "/college-admin-dashboard",
  student: "/dashboard",
};

const NavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.userRole);

  const handleLogout = () => {
    dispatch(logout());
   navigate("/");
  };

  return (
    <Navbar
    style={{
      background: "linear-gradient(to right, #FF7F50, #1E3A8A)", // Light orange and navy blue gradient
      padding: "0.5rem 1rem", // ✅ Reduced navbar height
      height: "60px" // ✅ Fixed height for better alignment
    }}
    variant="dark"
    expand="lg"
  >
    <Container>
      {/* ✅ Adjusted logo size to match navbar height */}
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
        <img
          src="https://res.cloudinary.com/djx9ffzob/image/upload/v1742406648/pngtree-graduate-3d-transparent-background-calligraphy-vector-art-png-image_12300371_thff7b.png"
          alt="Logo"
          style={{
            width: "80px", // ✅ Reduced width
            height: "70px", // ✅ Reduced height to match navbar height
            objectFit: "contain",
            marginRight: "20px"
          }}
        />
        <span
          style={{
            fontSize: "1.4rem", // ✅ Adjusted font size
            fontFamily: "'Montserrat', sans-serif", // ✅ Clean modern font
            fontWeight: "600",
            color: "#FFFFFF" // ✅ Text color
          }}
        >
          Services Management System
        </span>
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
