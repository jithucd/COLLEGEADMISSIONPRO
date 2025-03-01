import { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
import { getProfile, updateProfile, uploadProfilePicture } from "/src/services/user";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    email: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          
          const userData = await getProfile(); // Remove the token argument
          setProfile(userData);
          setUpdateData({
            name: userData.name,
            email: userData.email
          });
        } catch (error) {
          setMessage({ type: "danger", text: "Failed to load profile" });
        }
      };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await updateProfile(updateData, token);
      
      setProfile(response.user);
      setMessage({ type: "success", text: "Profile updated successfully" });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Failed to update profile" });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "warning", text: "Please select a file first" });
      return;
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const response = await uploadProfilePicture(formData, token);
      setProfile({ ...profile, profilePicture: response.imageUrl });
      setMessage({ type: "success", text: "Profile picture uploaded successfully" });
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to upload profile picture" });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Container className="py-4">
      <h1>Your Profile</h1>
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      <Row className="mt-4">
        <Col md={4} className="text-center mb-4">
          {profile.profilePicture ? (
            <Image 
              src={profile.profilePicture} 
              roundedCircle 
              style={{ width: "200px", height: "200px", objectFit: "cover" }} 
            />
          ) : (
            <div 
              className="bg-secondary rounded-circle mx-auto d-flex align-items-center justify-content-center"
              style={{ width: "200px", height: "200px" }}
            >
              <span className="text-white h1">{profile.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          
          <div className="mt-3">
            <Form.Group controlId="profilePicture">
              <Form.Label>Update Profile Picture</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={handleUpload} 
              className="mt-2"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </Col>
        
        <Col md={8}>
          {isEditing ? (
            <Form onSubmit={handleUpdateProfile}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  required
                />
              </Form.Group>
              
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updateData.email}
                  onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                  required
                />
              </Form.Group>
              
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role || "Student"}</p>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
