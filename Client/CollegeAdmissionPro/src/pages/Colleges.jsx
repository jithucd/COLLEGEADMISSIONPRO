import { useEffect, useState } from "react";
import { getAllColleges } from "../services/colleges";
import CollegeCard from "../components/CollegeCard";
import "bootstrap/dist/css/bootstrap.min.css";
const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await getAllColleges();
        setColleges(response);
      } catch (err) {
        setError("Failed to load colleges");
      }
    };
    fetchColleges();
  }, []);

  return (
    <div>
      <h1>Colleges</h1>
      {error && <p>{error}</p>}
      {colleges.map((college) => (
        <CollegeCard key={college._id} college={college} />
      ))}
    </div>
  );
};
export default Colleges;