// import { useEffect, useState } from "react";
// import { getAllCourses } from "../services/courses"; // Corrected import path
// import CourseCard from "../components/CourseCard";

// const Courses = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const response = await getAllCourses();
//       setCourses(response);
//     };
//     fetchCourses();
//   }, []);

//   return (
//     <div>
//       <h1>Courses</h1>
//       {courses.map((course) => (
//         <CourseCard key={course._id} course={course} />
//       ))}
//     </div>
//   );
// };

// export default Courses;
import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courses";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);

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

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Courses</h1>
      <div style={styles.grid}>
        {courses
          .filter((course) => course && course.title) // ✅ Defensive check to avoid undefined values
          .map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafc",
    backgroundImage: "url('/signupbg.jpg')",
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
};

export default Courses;
