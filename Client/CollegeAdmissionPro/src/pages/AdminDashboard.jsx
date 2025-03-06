import { useState, useEffect } from "react";
import { Container, Tab, Tabs, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { getAllUsers, getAllColleges, createCollege, deleteUser } from "../services/admin";

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

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteUser(userId, token);
        setUsers(users.filter(user => user._id !== userId));
        setMessage({ type: "success", text: "User deleted successfully" });
      } catch (err) {
        console.error("Error deleting user:", err);
        setMessage({ type: "danger", text: err.message || "Failed to delete user" });
      }
    }
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await createCollege(newCollege, token);
      setColleges([...colleges, response.college]);
      setNewCollege({ name: "", location: "", description: "" });
      setShowAddCollegeModal(false);
      setMessage({ type: "success", text: "College added successfully" });
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to add college" });
    }
  };
  const ApproveColleges = ({ colleges }) => {
    const handleApprove = async (collegeId) => {
      try {
        await approveCollege(collegeId);
        // Refresh college list
      } catch (err) {
        // Handle error
      }
    };

    return (
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Pending Approvals</Card.Title>
          <Table striped>
            <tbody>
              {colleges
                .filter(c => !c.approved)
                .map(college => (
                  <tr key={college._id}>
                    <td>{college.name}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(college._id)}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // User Role Management
  const UserRoleManager = ({ users }) => {
    const handleRoleChange = async (userId, newRole) => {
      try {
        await updateUserRole(userId, newRole);
        // Refresh user list
      } catch (err) {
        // Handle error
      }
    };

    return (
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="college_admin">College Admin</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
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
          <div className="d-flex justify-content-between mb-3">
            <h3>System Users</h3>
          </div>

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
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
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
            <Button onClick={() => setShowAddCollegeModal(true)}>Add New College</Button>
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
                      <Button
                        variant="info"
                        size="sm"
                        href={`/colleges/${college._id}`}
                        className="me-2"
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        href={`/admin/colleges/${college._id}/add-course`}
                      >
                        Add Course
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

      {/* Add College Modal */}
      <Modal show={showAddCollegeModal} onHide={() => setShowAddCollegeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New College</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCollege}>
            <Form.Group className="mb-3">
              <Form.Label>College Name</Form.Label>
              <Form.Control
                type="text"
                value={newCollege.name}
                onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newCollege.location}
                onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCollege.description}
                onChange={(e) => setNewCollege({ ...newCollege, description: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddCollegeModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add College
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;