import { useEffect, useState } from "react";
import { getAllColleges } from "../services/colleges";
import CollegeCard from "../components/CollegeCard";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      const response = await getAllColleges();
      setColleges(response);
    };
    fetchColleges();
  }, []);

  return (
    <div>
      <h1>Colleges</h1>
      {colleges.map((college) => (
        <CollegeCard key={college._id} college={college} />
      ))}
    </div>
  );
};

export default Colleges;