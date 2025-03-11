import { useState, useEffect } from "react";
import { Container, Tab, Tabs, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { getAllUsers, getAllColleges, toggleUserStatus, toggleCollegeStatus, createCollege } from "../services/admin";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }
        const [usersResponse, collegesResponse] = await Promise.all([
          getAllUsers(token),
          getAllColleges(token)
        ]);
        setUsers(usersResponse);
        setColleges(collegesResponse);
      } catch (err) {
        setError("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const handleToggleCollegeStatus = async (collegeId, isActive) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      // Toggle college status
      await toggleCollegeStatus(collegeId, isActive, token);

      // If college has an admin, update that user’s status too
      const college = colleges.find(c => c._id === collegeId);
      if (college && college.admin) {
        await toggleUserStatus(college.admin, isActive, token);
      }

      // Update local state for colleges
      setColleges(colleges.map(c =>
        c._id === collegeId ? { ...c, active: isActive } : c
      ));

      setMessage({ type: "success", text: `College ${isActive ? "activated" : "deactivated"} successfully` });
    } catch (err) {
      setError("Failed to toggle college status");
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      console.log("Toggling user status for:", userId, "Set active:", isActive);
      await toggleUserStatus(userId, isActive, token);
      setUsers(users.map(user =>
        user._id === userId ? { ...user, active: isActive } : user
      ));
      setMessage({ type: "success", text: `User ${isActive ? "activated" : "deactivated"} successfully` });
    } catch (err) {
      setError("Failed to toggle user status");
    }
  };

  const handleCreateCollege = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }
  
    try {
      const response = await createCollege(newCollege, token);
      console.log("College Created Successfully:", response);
  
      setMessage({ type: "success", text: "College added successfully" });
  
      // Refresh the college list immediately
      const updatedColleges = await getAllColleges(token);
      setColleges(updatedColleges);
  
      setShowAddCollegeModal(false);
    } catch (err) {
      setError("Failed to add college");
    }
  };

  return (
    <Container className="py-4">
      <h1>Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="Users">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant={user.active ? "danger" : "success"}
                      size="sm"
                      onClick={() => handleToggleUserStatus(user._id, !user.active)}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="colleges" title="Colleges">
          <div className="d-flex justify-content-between mb-3">
            <h3>Colleges</h3>
            <Button 
              onClick={() => {
                console.log("Add New College clicked");
                setShowAddCollegeModal(true);
              }}
            >
              Add New College
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(colleges) && colleges.length > 0 ? (
                colleges.map((college) => (
                  <tr key={college._id}>
                    <td>{college.name}</td>
                    <td>{college.location}</td>
                    <td>{college.courses?.length || 0}</td>
                    <td>
                      <Button variant="info" size="sm" href={`/colleges/${college._id}`} className="me-2">
                        View
                      </Button>
                      {/* Updated the route here to match the defined route in App.js */}
                      <Button variant="primary" size="sm" href={`/college/${college._id}/add-course`}>
                        Add Course
                      </Button>
                      <Button
                        variant={college.active ? "danger" : "success"}
                        size="sm"
                        onClick={() => handleToggleCollegeStatus(college._id, !college.active)}
                      >
                        {college.active ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No colleges found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      <Modal show={showAddCollegeModal} onHide={() => setShowAddCollegeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New College</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>College Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter college name"
                value={newCollege.name}
                onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={newCollege.location}
                onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={newCollege.description}
                onChange={(e) => setNewCollege({ ...newCollege, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateCollege}>
              Add College
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
