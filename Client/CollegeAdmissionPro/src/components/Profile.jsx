import { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Card, Image } from "react-bootstrap";
import { getProfile, updateProfile, uploadProfilePicture, uploadCertificate } from "../services/user";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    certificateUrl: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    email: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);

  // ✅ Fetch Profile Data and Ensure Certificate URL is Set Properly
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userData = await getProfile();
        console.log("Fetched Profile Data:", userData);

        setProfile({
          name: userData.name,
          email: userData.email,
          profilePicture: userData.profilePicture || "",
          certificateUrl: userData.certificateUrl || "" // ✅ Ensure certificateUrl is set
        });

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

  // ✅ Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(updateData);
      setProfile((prev) => ({
        ...prev,
        name: response.user.name,
        email: response.user.email
      }));
      setMessage({ type: "success", text: "Profile updated successfully" });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Failed to update profile" });
    }
  };

  // ✅ Handle Profile Picture Upload
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "warning", text: "Please select a file first" });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await uploadProfilePicture(formData);
      setProfile((prev) => ({
        ...prev,
        profilePicture: response.imageUrl
      }));
      setMessage({ type: "success", text: "Profile picture uploaded successfully" });
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to upload profile picture" });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  // ✅ Handle Certificate Upload
  const handleCertificateChange = (e) => setCertificateFile(e.target.files[0]);

  const handleUploadCertificate = async () => {
    if (!certificateFile) {
      setMessage({ type: "warning", text: "Please select a certificate file first" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("certificate", certificateFile);

      const response = await uploadCertificate(formData);
      setProfile((prev) => ({
        ...prev,
        certificateUrl: response.certificateUrl // ✅ Update certificate URL correctly
      }));
      setMessage({ type: "success", text: "Certificate uploaded successfully" });
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to upload certificate" });
    } finally {
      setCertificateFile(null);
    }
  };

  // ✅ Styles
  const styles = {
    container: {
      backgroundColor: "#faf3e0",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      marginTop: "20px"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#2c3e50",
      borderBottom: "3px solid #ff6f61",
      paddingBottom: "12px",
      marginBottom: "24px"
    },
    card: {
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
      border: "1px solid #f0f0f0"
    },
    buttonPrimary: {
      backgroundColor: "#ff6f61",
      borderColor: "#ff6f61",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    },
    profileImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "50%",
      border: "3px solid #e0e0e0"
    },
    certificateImage: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginTop: "10px"
    }
  };

  return (
    <Container style={styles.container}>
      <h1 style={styles.title}>Your Profile</h1>
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: "", text: "" })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="g-4">
        {/* Upload Profile Picture */}
        <Col md={4}>
          <Card style={styles.card}>
            {profile.profilePicture && (
              <Image src={profile.profilePicture} style={styles.profileImage} />
            )}
            <Form.Control type="file" onChange={handleFileChange} className="mt-3" />
            <Button onClick={handleUpload} style={styles.buttonPrimary} className="mt-2">
              Upload
            </Button>
          </Card>
        </Col>

        {/* Edit Profile */}
        <Col md={4}>
          <Card style={styles.card}>
            {isEditing ? (
              <Form onSubmit={handleUpdateProfile}>
                <Form.Control
                  type="text"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                />
                <Form.Control
                  type="email"
                  value={updateData.email}
                  onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                />
                <Button type="submit" style={styles.buttonPrimary}>Save</Button>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              </Form>
            ) : (
              <>
                <p>Name: {profile.name}</p>
                <p>Email: {profile.email}</p>
                <Button onClick={() => setIsEditing(true)} style={styles.buttonPrimary}>
                  Edit Profile
                </Button>
              </>
            )}
          </Card>
        </Col>

        {/* Upload Certificate */}
        <Col md={4}>
          <Card style={styles.card}>
            {profile.certificateUrl && (
              <Image src={profile.certificateUrl} style={styles.certificateImage} />
            )}
            <Form.Control type="file" onChange={handleCertificateChange} />
            <Button onClick={handleUploadCertificate}>Upload Certificate</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
