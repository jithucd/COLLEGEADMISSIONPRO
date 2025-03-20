import { useEffect, useState } from "react";
import { getAllColleges } from "../services/colleges";
import CollegeCard from "../components/CollegeCard";
import "bootstrap/dist/css/bootstrap.min.css";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await getAllColleges();
        setColleges(response);
      } catch (err) {
        setError("Failed to load colleges");
      }finally{
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  // ✅ Filter colleges based on name and location
  const filteredColleges = colleges.filter(
    (college) =>
      college?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* ✅ Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by college or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <h1 style={styles.header}>Explore Colleges</h1>
      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
      <div style={styles.grid}>
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <CollegeCard key={college._id} college={college} />
          ))
        ) : (
          <p style={styles.noResults}>No colleges found</p>
        )}
      </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f9fafc",
    backgroundImage: "url('/images/carousel4.jpg')",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "10px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "50%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s ease",
  },
  noResults: {
    textAlign: "center",
    color: "#7f8c8d",
    fontSize: "1.2rem",
  },
};

export default Colleges;
