import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Card ,Badge} from 'react-bootstrap';
import { getCollegeAdminData, getCollegeAdmissions, updateAdmissionStatus } from '../services/collegeAdmin';

const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  
  const [college, setCollege] = useState(null);
  const [admissions, setAdmissions] = useState([]);

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
      }
    };
    fetchData();
  }, []);

  const handleAdmissionDecision = async (admissionId, status) => {
    console.log("Updating admission status...", { admissionId, status });
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
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };
  return (
    <Container className="my-4">
      {college ? (
        <>
          <h2>{college.name} Dashboard</h2>
  
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Course Management</Card.Title>
              <Button 
                variant="primary" 
                href={`/college/${college._id}/add-course`}
                 
              >
                Add New Course
              </Button>
              <div className="mt-3">
                <h5>Existing Courses:</h5>
                {college.courses && college.courses.length > 0 ? (
                  <ul>
                    {college.courses.map(course => (
                      <li key={course._id}>
                        <strong>{course.title}</strong>: {course.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No courses found.</p>
                )}
              </div>
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
        </>
      ) : (
        <div>Loading college data...</div>
      )}
    </Container>
  );
};

export default CollegeAdminDashboard;
