import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Colleges from "./pages/Colleges";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import AdmissionPage from "./pages/AdmissionPage";
import AdmissionStatus from "./components/AdmissionStatus";
import CollegeAdminDashboard from "./pages/CollegeAdminDashboard";
import CollegeDetail from "./pages/CollegeDetail";
import AddCourse from "./pages/AddCourse";
import ProfilePage from "./components/Profile";
import {  useAuth  } from "./context/AuthContext";
function App() {
  const { userRole } = useAuth(); 
  return (
    <div style={styles.wrapper}>
     
      <BrowserRouter>
        <Navbar key={userRole}/>
        <div style={styles.content}>
          <Container fluid className="px-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admission/:courseId" element={<AdmissionPage />} />
              <Route path="/admission/:admissionId/status" element={<AdmissionStatus />} />
              <Route path="/college-admin-dashboard" element={<CollegeAdminDashboard />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              <Route path="/add-course" element={<AddCourse />} />
              <Route path="/college/:collegeId/add-course" element={<AddCourse />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Container>
        </div>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // ✅ Make sure it fills the entire viewport
    overflowX: "hidden", // ✅ Remove horizontal scroll
  },
  content: {
    flex: 1, // ✅ Allow the content to expand naturally
    paddingBottom: "20px", // ✅ Prevent footer from floating
  },
};

export default App;