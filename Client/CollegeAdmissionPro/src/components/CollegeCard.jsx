const CollegeCard = ({ college }) => {
    return (
      <div>
        <h2>{college.name}</h2>
        <p>{college.location}</p>
        <p>{college.description}</p>
      </div>
    );
  };
  
  export default CollegeCard;