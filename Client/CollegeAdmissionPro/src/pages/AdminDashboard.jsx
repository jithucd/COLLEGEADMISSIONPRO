import { useState, useEffect } from "react";
import { Container, Tab, Tabs, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { getAllUsers, getAllColleges, toggleUserStatus, toggleCollegeStatus, createCollege, getCollegeProof } from "../services/admin";
import { Image } from "react-bootstrap";


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
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofUrl, setProofUrl] = useState("");


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
        console.log("✅ Users:", usersResponse);
        console.log("✅ Colleges:", collegesResponse);
        setUsers(usersResponse);
        const updatedColleges = collegesResponse.map((college) => {
          const adminUser = usersResponse.find(user => user.college === college._id);
          return {
            ...college,
            active: adminUser ? adminUser.active : false, // ✅ Sync college status with user status
            adminName: adminUser ? adminUser.name : "N/A"
          };
        });
        setColleges(updatedColleges);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
        setError("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);


  const handleVerifyCollege = async (collegeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      const result = await getCollegeProof(collegeId, token);
      console.log("✅ Proof Data:", result);
      setProofUrl(result.proofUrl);
      setShowProofModal(true);
    } catch (err) {
      console.error("❌ Failed to load proof:", err.message);
      setError("Failed to load proof document");
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

      // Create an updated users array
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, active: isActive } : user
      );
      setUsers(updatedUsers);
      // ✅ Update corresponding college status
      const user = updatedUsers.find(u => u._id === userId);
      if (user && user.role === "college_admin" && user.college) {
        setColleges((prevColleges) =>
          prevColleges.map(college =>
            college._id === user.college
              ? { ...college, active: isActive }
              : college
          )
        );
      }

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
          <Alert variant="info">
  📢 <strong>Note:</strong> Please click the <strong>"Verify"</strong> button to check the college proof.  
  To activate/deactivate the account, go to the <strong>Users</strong> tab and click the <strong>Action</strong> button.
</Alert>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>

                <th>Admin Name</th> {/* ✅ New Column */}
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(colleges) && colleges.length > 0 ? (
                colleges.map((college) => (
                  <tr key={college._id}>
                    <td>{college.name}</td>
                    <td>{college.location}</td>

                    <td>{college.adminName}</td>
                    <td>
                      <Button variant="info" size="sm" href={`/colleges/${college._id}`} className="me-2">
                        View
                      </Button>
                      {/* Updated the route here to match the defined route in App.js */}
                      <Button variant="primary" size="sm" href={`/college/${college._id}/courses`}>
                        Add Course
                      </Button>
                      {/* <Button
                        variant={college.active ? "danger" : "success"}
                        size="sm"
                        onClick={() => handleToggleCollegeStatus(college._id, college.active)}
                      >
                        {college.active ? "Deactivate" : "Activate"}
                      </Button> */}

                      {/* ✅ New Verify Button */}
                      {/* {college.proofUrl && ( */}
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleVerifyCollege(college._id)}
                      >
                        Verify
                      </Button>
                      {/* )} */}
                    </td>
                    <td>
                      {/* ✅ Display Status as Label */}
                      <span
                        className={`badge ${college.active ? "bg-success" : "bg-danger"
                          }`}
                      >
                        {college.active ? "Active" : "Inactive"}
                      </span>
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
      <Modal
        show={showProofModal}
        onHide={() => setShowProofModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>College Proof Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {proofUrl ? (
            proofUrl.endsWith(".pdf") ? (
              <iframe
                src={proofUrl}
                title="Proof Document"
                style={{ width: "100%", height: "500px" }}
              />
            ) : (
              <Image src={proofUrl} alt="College Proof" className="img-fluid" />
            )
          ) : (
            <Alert variant="danger">No proof available</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProofModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
