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
  updateCollegeDetails,
} from "../services/collegeAdmin";
import { FaEdit, FaUpload } from "react-icons/fa";

const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditCollegeModal, setShowEditCollegeModal] = useState(false); // ✅ New State for College Edit Modal
  const [editedCollege, setEditedCollege] = useState({});
  const [proofData, setProofData] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(null);
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
  // For image upload
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // For proof upload
  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handleEditCollege = () => {
    setEditedCollege({
      name: college?.name || "",
      location: college?.location || "",
      proofUrl: college?.proofUrl || "",
      description: college?.description || "",
    });
    setShowEditCollegeModal(true);
  };

  // ✅ Handle submission of college edit
  const handleSubmitEditCollege = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedCollege = await updateCollegeDetails(college._id, {
        ...editedCollege,
        proofUrl: editedCollege.proofUrl, // Include proofUrl
      }, token);

      setCollege(updatedCollege);
      setShowEditCollegeModal(false);
      alert("College details updated successfully!");
    } catch (error) {
      console.error("Failed to update college details:", error);
      alert("Failed to update college details");
    }
  };



  // ✅ Handle input change in the edit form
  const handleChangeCollegeData = (e) => {
    const { name, value } = e.target;
    setEditedCollege((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteCourse(selectedCourse._id, token);
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
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/college-admin/${adminId}`, {
        proofUrl, // Add proofUrl to request
        otherData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Updated:', response.data);
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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

        `${import.meta.env.VITE_API_URL}/api/colleges/upload-image/${college._id}`,
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
      setCollege((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    }
  };

  const handleUploadProof = async () => {
    if (!proofFile) return alert("Please select a proof file");

    const formData = new FormData();
    formData.append("file", proofFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/college-admin/upload-proof/${college._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: When sending FormData, do not set the "Content-Type" header manually.
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to upload proof: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      if (data.url) {
        alert("Proof uploaded successfully!");
        // Update the college state with the new proof URL
        setCollege((prev) => ({ ...prev, proofUrl: data.url }));
        setProofFile(null);
      }
    } catch (error) {
      console.error("Error uploading proof:", error);
      alert("Failed to upload proof");
    }
  };

  const handleViewCertificate = (certificateUrl) => {
    if (certificateUrl) {
      setCertificateUrl(certificateUrl);
      setShowCertificateModal(true);
    } else {
      alert("No certificate available");
    }
  };



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
        backgroundImage: "url('/images/bg4.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {college ? (
        <>
          {/* College Header with Image Upload */}
          <Card className="shadow-sm mb-4" >
            <Card.Body>
              <Row className="g-4 align-items-center">
                {/* Image Upload Column */}
                <Col md={3}>
                  <div className="border-dashed rounded-3 p-4 text-center bg-light">
                    <div className="mb-3">
                      <input
                        type="file"
                        id="imageUpload"
                        className="d-none"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="btn btn-outline-primary btn-lg"
                      >
                        <FaUpload className="me-2" />
                        Choose Image
                      </label>
                    </div>

                    {selectedFile && (
                      <>
                        <Button
                          variant="primary"
                          onClick={handleUpload}
                          className="mb-2"
                          disabled={!selectedFile}
                        >
                          Upload Selected Image
                        </Button>
                        <p className="text-muted small mb-0">
                          Selected file: {selectedFile.name}
                        </p>
                      </>
                    )}
                  </div>
                </Col>

                {/* College Name and Preview Column */}
                <Col md={6}>
                  <div className="d-flex flex-column align-items-end">
                    <h2 className="text-primary mb-3">{college.name}</h2>
                    <div className="border rounded-3 p-2 w-100">
                      <h6 className="text-muted mb-3">College Image Preview</h6>
                      {college?.imageUrl ? (
                        <Image
                          src={college.imageUrl}
                          alt="College"
                          fluid
                          className="rounded-2"
                          style={{
                            maxHeight: '200px',
                            objectFit: 'cover',
                            width: '100%'
                          }}
                        />
                      ) : (
                        <div className="bg-light text-muted p-4 rounded-2 text-center">
                          No image uploaded yet
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* College Header */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="g-4 align-items-center">
                <Col md={4}>
                  <h2 className="text-primary mb-3">{college.name}</h2>
                  <p>
                    <strong>Location:</strong> {college.location || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong> {college.description || "N/A"}
                  </p>
                  {/* <p>
                    <strong>Proof URL:</strong>{" "}
                    <a href={college.proofUrl || "#"} target="_blank" rel="noopener noreferrer">
                      {college.proofUrl || "Not Provided"}
                    </a>
                  </p> */}
                </Col>
               
                <Col md={4} className="text-end">
                  <Button variant="warning" onClick={handleEditCollege}>
                    <FaEdit className="me-2" />
                    Edit College Details
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Admissions Section */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Pending Admissions</h5>
            </Card.Header>
            <Card.Body>
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
                              console.log("Selected Admission: ", admission);
                              setSelectedAdmission({
                                ...admission,
                                certificateUrl: admission.user?.certificateUrl || null, // ✅ Pass certificateUrl directly
                              });
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
                        <td>
                          {/* ✅ "View Certificate" Button */}
                          {admission.certificateUrl ? (
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleViewCertificate(admission.certificateUrl)}
                            >
                              View Certificate
                            </Button>
                          ) : (
                            <span>No Certificate</span>
                          )}
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
              {/* ✅ Certificate Modal */}
              <Modal
                show={showCertificateModal}
                onHide={() => setShowCertificateModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Student Certificate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {certificateUrl ? (
                    <img
                      src={certificateUrl}
                      alt="Certificate"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <p>No certificate available</p>
                  )}
                </Modal.Body>
              </Modal>
            </Card.Body>

          </Card>

          {/* Course Management Section */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Course Management</h5>
            </Card.Header>
            <Card.Body>
              <Button
                variant="primary"
                href={`/college/${college._id}/courses`}
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
          <Modal
            show={showEditCollegeModal}
            onHide={() => setShowEditCollegeModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit College Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* College Name */}
                <Form.Group className="mb-3">
                  <Form.Label>College Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedCollege.name}
                    onChange={handleChangeCollegeData}
                  />
                </Form.Group>

                {/* Location */}
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editedCollege.location}
                    onChange={handleChangeCollegeData}
                  />
                </Form.Group>

                {/* Proof URL */}
                {/* <Form.Group className="mb-3">
                  <Form.Label>Upload Proof</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                  {selectedFile && (
                    <Button onClick={handleUploadProof} className="mt-2">
                      Upload Proof
                    </Button>
                  )}
                </Form.Group> */}

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editedCollege.description}
                    onChange={handleChangeCollegeData}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditCollegeModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitEditCollege}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Modals */}
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
                  {/* ✅ Show Certificate if available */}
                  {selectedAdmission?.certificateUrl && (
                    <Image
                      src={selectedAdmission.certificateUrl}
                      alt="Certificate"
                      fluid
                      style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                    />
                  )}
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
            <Modal show={showProofModal} onHide={() => setShowProofModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>College Proof</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {proofData ? (
                  <img src={proofData.url} alt="College Proof" style={{ width: "100%" }} />
                ) : (
                  <p>No proof available</p>
                )}
              </Modal.Body>
            </Modal>

          </Modal>

        </>
      ) : (
        <div className="text-center text-danger">Failed to load college data.</div>
      )}

    </Container>
  );
};

export default CollegeAdminDashboard;