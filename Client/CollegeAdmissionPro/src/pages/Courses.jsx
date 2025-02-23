import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courses"; // Corrected import path
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getAllCourses();
      setCourses(response);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default Courses;