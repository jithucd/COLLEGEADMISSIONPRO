import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

 

// Enhanced loader component
// const Loader = () => (
//   <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
//     <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p className="mt-3 text-muted">Loading your content...</p>
//   </div>
// );
export default Loader;