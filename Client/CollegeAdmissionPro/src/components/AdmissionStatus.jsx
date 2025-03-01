// Client/CollegeAdmissionPro/src/components/AdmissionStatus.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAdmissionStatus } from '../services/admission';

const AdmissionStatus = () => {
  const { admissionId } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getAdmissionStatus(admissionId);
        setAdmission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [admissionId]);

  return (
    <div className="p-4">
      <h3>Admission Status</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Status: {admission.status}</p>
          <p>Course: {admission.course.title}</p>
          {/* Add more details */}
        </div>
      )}
    </div>
  );
};

export default AdmissionStatus;