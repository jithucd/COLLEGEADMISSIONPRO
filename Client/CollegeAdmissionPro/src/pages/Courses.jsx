import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courses";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        if (Array.isArray(response)) {
          setCourses(response);
        } else {
          console.error("Invalid data format:", response);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Filter courses based on title or college name
  const filteredCourses = courses.filter(
    (course) =>
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.college?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* ✅ Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by course or college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <h1 style={styles.header}>Courses</h1>

      <div style={styles.grid}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p style={styles.noResults}>No courses found</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafc",
    backgroundImage: "url('/images/signupbg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "20px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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

export default Courses;
