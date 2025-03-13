// import { Container, Row, Col } from "react-bootstrap";

// const Footer = () => {
//   return (
//     <footer className="footer mt-auto py-3 bg-dark text-white text-center">
//     <div className="container">
//       <span>© 2025 Admission guidance</span>
//     </div>
//   </footer>
//   );
// };

// export default Footer;
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <Container>
        <span>&copy; 2025 Admission Guidance. All rights reserved.</span>
      </Container>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#001a3a", // ✅ Dark background
    color: "white", // ✅ White text
    // ✅ Consistent padding
    textAlign: "center",
    position: "fixed", // ✅ Fix at the bottom
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 10, // ✅ Keep above other elements
    fontSize: "12px",
    height:"25px",
   
    boxShadow: "0px -2px 10px rgba(0,0,0,0.2)", // ✅ Subtle shadow for depth
  },
};

export default Footer;
