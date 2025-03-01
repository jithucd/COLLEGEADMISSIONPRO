import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { getCollegeAdminData, getCollegeAdmissions, updateAdmissionStatus } from '../services/collegeAdmin';

const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [admissions, setAdmissions] = useState([]); // ✅ Ensure it's an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeData = await getCollegeAdminData();
        const admissionsData = await getCollegeAdmissions();
        
        setCollege(collegeData);
        setAdmissions(Array.isArray(admissionsData) ? admissionsData : []); // ✅ Ensure admissions is an array
      } catch (err) {
        console.error("Error fetching data:", err);
        setAdmissions([]); // ✅ Fallback to empty array
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

  return (
    <Container className="my-4">
      <h2>{college?.name} Dashboard</h2>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Course Management</Card.Title>
          <Button 
            variant="primary" 
            onClick={() => navigate('/add-course')}
          >
            Add New Course
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Pending Admissions</Card.Title>
          <Table striped>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.length > 0 ? ( // ✅ Removed unnecessary `{}` 
                admissions.map((admission) => (
                  <tr key={admission._id}>
                    <td>{admission.student?.name || "Unknown"}</td>
                    <td>{admission.course?.title || "Unknown"}</td>
                    <td>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleAdmissionDecision(admission._id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => handleAdmissionDecision(admission._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No admissions found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CollegeAdminDashboard;
