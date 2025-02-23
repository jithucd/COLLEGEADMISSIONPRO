const CourseCard = ({ course }) => {
    return (
      <div>
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p>Fees: {course.fees}</p>
        <p>Duration: {course.duration}</p>
      </div>
    );
  };
  
  export default CourseCard;