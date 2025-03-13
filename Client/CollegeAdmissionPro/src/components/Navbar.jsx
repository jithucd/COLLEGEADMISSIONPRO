// import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// const NavigationBar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLoggedIn(true);
//       // In a real app, you would decode the JWT to get user role
//       // For now, we'll try to get it from localStorage if it exists
//       const role = localStorage.getItem("userRole");
//       if (role) setUserRole(role);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     setIsLoggedIn(false);
//     setUserRole(null);
//     navigate("/login");
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg">
//       <Container>
//         <Navbar.Brand as={Link} to="/"> Services Management System</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             <Nav.Link as={Link} to="/colleges">Colleges</Nav.Link>
//             <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            
//             {isLoggedIn ? (
//               <>
               
//                 <NavDropdown title="Account" id="basic-nav-dropdown">
                 
//                   {userRole === "admin" && (
//                   <NavDropdown.Item as={Link} to="/admin-dashboard">Admin Dashboard</NavDropdown.Item>
//                 )}
//                 {userRole === "college_admin" && (
//                   <NavDropdown.Item as={Link} to="/college-admin-dashboard">College Dashboard</NavDropdown.Item>
//                 )}
//                    {userRole === "student" && (
//                   <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
//                 )}
//                   <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
//                 </NavDropdown>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login">Login</Nav.Link>
//                 <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavigationBar;
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUniversity, FaBook, FaUserCircle } from "react-icons/fa";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

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

            {isLoggedIn ? (
              <NavDropdown
                title={<FaUserCircle style={{ fontSize: "1.5rem" }} />}
                id="collapsible-nav-dropdown"
                align="end"
              >
                {userRole === "admin" && (
                  <NavDropdown.Item as={Link} to="/admin-dashboard">
                    Admin Dashboard
                  </NavDropdown.Item>
                )}
                {userRole === "college_admin" && (
                  <NavDropdown.Item as={Link} to="/college-admin-dashboard">
                    College Dashboard
                  </NavDropdown.Item>
                )}
                {userRole === "student" && (
                  <NavDropdown.Item as={Link} to="/dashboard">
                    Student Dashboard
                  </NavDropdown.Item>
                )}
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
                <Nav.Link as={Link} to="/login" className="login-button">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="signup-button">
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
