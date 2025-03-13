
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Card,
  Badge,
  Row,
  Col,
  Form,
  Spinner,
  Image,
  Modal,
} from "react-bootstrap";
import {
  getCollegeAdminData,
  getCollegeAdmissions,
  updateAdmissionStatus,
  deleteCourse,
  updateCourse,
} from "../services/collegeAdmin";
import { FaEdit } from "react-icons/fa";
const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Selected items for editing, deletion, or viewing
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [collegeImage, setCollegeImage] = useState(null);
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeData = await getCollegeAdminData();
        const admissionsData = await getCollegeAdmissions();
        setCollege(collegeData);
        setAdmissions(Array.isArray(admissionsData) ? admissionsData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setCollege(null);
        setAdmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle admission decision
  const handleAdmissionDecision = async (admissionId, status) => {
    try {
      await updateAdmissionStatus(admissionId, status);
      setAdmissions((prevAdmissions) =>
        prevAdmissions.map((admission) =>
          admission._id === admissionId ? { ...admission, status } : admission
        )
      );
    } catch (err) {
      console.error("Error updating admission:", err);
    }
  };

 
  // Handle course deletion
  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteCourse(selectedCourse._id,token);
      setCollege((prevCollege) => ({
        ...prevCollege,
        courses: prevCollege.courses.filter(
          (course) => course._id !== selectedCourse._id
        ),
      }));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  // Handle course update
  const handleUpdateCourse = async (updatedCourse) => {
    try {
      await updateCourse(selectedCourse._id, updatedCourse);
      setCollege((prevCollege) => ({
        ...prevCollege,
        courses: prevCollege.courses.map((course) =>
          course._id === selectedCourse._id ? updatedCourse : course
        ),
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update course:", err);
    }
  };
 // Handle image upload
 const handleImageUpload = async (e) => {
  e.preventDefault();
  if (!image) return;

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch(`/api/colleges/${college._id}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Image upload success:", data);
    // Refresh college data to show the updated image
    const collegeData = await getCollegeAdminData();
    setCollege(collegeData);
  } catch (err) {
    console.error("Failed to upload image:", err);
  }
};

// Handle file input change
const handleFileChange = (e) => {
  if (e.target.files[0]) {
    setSelectedFile(e.target.files[0]);
    // setImage(e.target.files[0]);
    // handleImageUpload(e); 
  }
};
const handleUpload = async () => {
  if (!selectedFile || !college?._id) {
    alert('Please select a file first');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `http://localhost:5000/api/colleges/upload-image/${college._id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    setCollege((prev) => ({ ...prev, imageUrl: data.imageUrl })); // Update state with new URL
    alert('Image uploaded successfully!');
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Failed to upload image');
  }
};

  // Get status badge for admissions
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="p-4"
      style={{
        backgroundColor: "#f8f9fa",
        backgroundImage: "url('/bg4.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div>
      <h2>Upload College Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {college?.imageUrl && (
  <img
    src={college.imageUrl}
    alt="College"
    width="200"
    style={{ objectFit: 'cover', borderRadius: '8px' }}
  />
)}
    </div>
      {college ? (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="text-white">{college.name} Dashboard</h2>
              <p className="text-white">Manage courses and admissions for your college.</p>
             
            </Col>
          </Row>
         

          {/* Pending Admissions Section */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Pending Admissions</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.length > 0 ? (
                    admissions.map((admission) => (
                      <tr key={admission._id}>
                        <td>{admission.user?.name || "Unknown"}</td>
                        <td>{admission.course?.title || "Unknown"}</td>
                        <td>{getStatusBadge(admission.status)}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => {
                              setSelectedAdmission(admission);
                              setShowAdmissionModal(true);
                            }}
                            className="me-2"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleAdmissionDecision(admission._id, "approved")
                            }
                            className="me-2"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleAdmissionDecision(admission._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No admissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Course Management Section */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Course Management</Card.Title>
              <Button
                variant="primary"
                href={`/college/${college._id}/add-course`}
                className="mb-3"
              >
                Add New Course
              </Button>
              <div className="mt-3">
                <h5>Existing Courses</h5>
                {college.courses && college.courses.length > 0 ? (
                  <ul className="list-group">
                    {college.courses.map((course) => (
                      <li
                        key={course._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{course.title}</strong>: {course.duration}
                        </div>
                        <div>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowEditModal(true);
                            }}
                            className="me-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No courses found.</p>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Modals */}
          {/* Edit Course Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={selectedCourse?.title}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        title: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Course Duration</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={selectedCourse?.duration}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        duration: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateCourse(selectedCourse)}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Course Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete the course:{" "}
              <strong>{selectedCourse?.title}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteCourse}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* View Admission Details Modal */}
          <Modal
            show={showAdmissionModal}
            onHide={() => setShowAdmissionModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Admission Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedAdmission && (
                <>
                  <p>
                    <strong>Student Name:</strong>{" "}
                    {selectedAdmission.user?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Course:</strong>{" "}
                    {selectedAdmission.course?.title || "Unknown"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedAdmission.status)}
                  </p>
                  {/* Add more admission details here */}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAdmissionModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <div className="text-center text-danger">Failed to load college data.</div>
      )}
    </Container>
  );
};

export default CollegeAdminDashboard;