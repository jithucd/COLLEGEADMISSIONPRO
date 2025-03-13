// import { useEffect, useState } from "react";
// import { getAllColleges } from "../services/colleges";
// import CollegeCard from "../components/CollegeCard";
// import "bootstrap/dist/css/bootstrap.min.css";
// const Colleges = () => {
//   const [colleges, setColleges] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchColleges = async () => {
//       try {
//         const response = await getAllColleges();
//         setColleges(response);
//       } catch (err) {
//         setError("Failed to load colleges");
//       }
//     };
//     fetchColleges();
//   }, []);

//   return (
//     <div>
//       <h1>Colleges</h1>
//       {error && <p>{error}</p>}
//       {colleges.map((college) => (
//         <CollegeCard key={college._id} college={college} />
//       ))}
//     </div>
//   );
// };
// export default Colleges;
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
    <div style={styles.container}>
      <h1 style={styles.header}>Explore Colleges</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {colleges.map((college) => (
          <CollegeCard key={college._id} college={college} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f9fafc",
    backgroundImage: "url('/carousel4.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "white",
    marginBottom: "30px",
    textAlign: "center",
  },
  error: {
    color: "#e74c3c",
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // ✅ Two columns per row
    gap: "20px",
    justifyContent: "center",
    padding: "10px",
  },
};

export default Colleges;
