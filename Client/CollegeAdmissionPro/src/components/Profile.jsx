// import { useState, useEffect } from "react";
// import { Container, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
// import { getProfile, updateProfile, uploadProfilePicture } from "../services/user";

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     profilePicture: ""
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [updateData, setUpdateData] = useState({
//     name: "",
//     email: ""
//   });
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const userData = await getProfile();
//         setProfile(userData);
//         setUpdateData({
//           name: userData.name,
//           email: userData.email
//         });
//       } catch (error) {
//         setMessage({ type: "danger", text: "Failed to load profile" });
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await updateProfile(updateData);
//       setProfile(response.user);
//       setMessage({ type: "success", text: "Profile updated successfully" });
//       setIsEditing(false);
//     } catch (error) {
//       setMessage({ type: "danger", text: error.message || "Failed to update profile" });
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setMessage({ type: "warning", text: "Please select a file first" });
//       return;
//     }

//     try {
//       setIsUploading(true);
//       const formData = new FormData();
//       formData.append("image", selectedFile);

//       const response = await uploadProfilePicture(formData);
//       setProfile({ ...profile, profilePicture: response.imageUrl });
//       setMessage({ type: "success", text: "Profile picture uploaded successfully" });
//     } catch (error) {
//       setMessage({ type: "danger", text: "Failed to upload profile picture" });
//     } finally {
//       setIsUploading(false);
//       setSelectedFile(null);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <h1>Your Profile</h1>
//       {message.text && (
//         <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
//           {message.text}
//         </Alert>
//       )}

//       <Row className="mt-4">
//         <Col md={4} className="text-center mb-4">
//           {profile.profilePicture ? (
//             <Image src={profile.profilePicture} roundedCircle style={{ width: "200px", height: "200px", objectFit: "cover" }} />
//           ) : (
//             <div className="bg-secondary rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: "200px", height: "200px" }}>
//               <span className="text-white h1">{profile.name?.charAt(0).toUpperCase()}</span>
//             </div>
//           )}

//           <div className="mt-3">
//             <Form.Group controlId="profilePicture">
//               <Form.Label>Update Profile Picture</Form.Label>
//               <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
//             </Form.Group>
//             <Button variant="primary" onClick={handleUpload} className="mt-2" disabled={isUploading || !selectedFile}>
//               {isUploading ? "Uploading..." : "Upload"}
//             </Button>
//           </div>
//         </Col>

//         <Col md={8}>
//           {isEditing ? (
//             <Form onSubmit={handleUpdateProfile}>
//               <Form.Group controlId="name" className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={updateData.name}
//                   onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="email" className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   value={updateData.email}
//                   onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
//                   required
//                 />
//               </Form.Group>

//               <div className="d-flex gap-2">
//                 <Button variant="primary" type="submit">Save Changes</Button>
//                 <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
//               </div>
//             </Form>
//           ) : (
//             <div>
//               <p><strong>Name:</strong> {profile.name}</p>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Role:</strong> {profile.role || "Student"}</p>
//               <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
//             </div>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Profile;
import { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
import { getProfile, updateProfile, uploadProfilePicture } from "../services/user";

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

        const userData = await getProfile();
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
      const response = await updateProfile(updateData);
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
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await uploadProfilePicture(formData);
      setProfile({ ...profile, profilePicture: response.imageUrl });
      setMessage({ type: "success", text: "Profile picture uploaded successfully" });
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to upload profile picture" });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  // Inline styles
  const styles = {
    container: {
      backgroundColor: "#f9fafc",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginTop: "20px"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "600",
      color: "#2c3e50",
      borderBottom: "2px solid #007bff",
      paddingBottom: "10px",
      marginBottom: "20px"
    },
    profileImage: {
      width: "180px",
      height: "180px",
      objectFit: "cover",
      borderRadius: "50%",
      border: "4px solid #e0e0e0",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
    },
    profilePlaceholder: {
      width: "180px",
      height: "180px",
      backgroundColor: "#f0f0f0",
      color: "#7f8c8d",
      fontSize: "64px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    formControl: {
      borderRadius: "8px",
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ddd"
    },
    button: {
      borderRadius: "20px",
      padding: "10px 20px",
      fontWeight: "500",
      transition: "background-color 0.3s ease"
    },
    buttonPrimary: {
      backgroundColor: "#007bff",
      borderColor: "#007bff",
      color: "#fff"
    },
    buttonSecondary: {
      backgroundColor: "#6c757d",
      borderColor: "#6c757d",
      color: "#fff"
    },
    buttonHover: {
      backgroundColor: "#0056b3"
    }
  };

  return (
    <Container style={styles.container}>
      <h1 style={styles.title}>Your Profile</h1>
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      <Row className="mt-4">
        <Col md={4} className="text-center">
          {profile.profilePicture ? (
            <Image src={profile.profilePicture} style={styles.profileImage} />
          ) : (
            <div style={styles.profilePlaceholder}>
              <span>{profile.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}

          <Form.Group controlId="profilePicture" className="mt-3">
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={styles.formControl}
            />
          </Form.Group>
          <Button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
            className="mt-2"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
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
                  style={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updateData.email}
                  onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                  required
                  style={styles.formControl}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role || "Student"}</p>
              <Button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={() => setIsEditing(true)}
              >
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
