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
// import SuperAdminLogin from "./pages/SuperAdminLogin";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import { Container } from "react-bootstrap";
import AdmissionPage from "./pages/AdmissionPage";
import AdmissionStatus from "./components/AdmissionStatus";
import CollegeAdminDashboard from './pages/CollegeAdminDashboard';
import CollegeDetail from './pages/CollegeDetail';
import AddCourse from './pages/AddCourse';
import ProfilePage from "./components/Profile";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          {/* <Route path="/superadmin-login" element={<SuperAdminLogin />} />
      <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} /> */}
          
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
          <Route path="/add-course" element={<AddCourse />}/>
          <Route path="/college/:collegeId/add-course" element={<AddCourse />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  );
}

export default App;