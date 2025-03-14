// import { Container, Paper, Box, Button, Typography } from "@mui/material";
// import { Grid } from "@mui/system";
// import SchoolIcon from "@mui/icons-material/School";
// import BookIcon from "@mui/icons-material/Book";
// import { Link } from "react-router-dom";
// import "@fontsource/poppins";

// const backgroundStyle = {
//   background: `
//     linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
//     url('https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg')
//     center/cover fixed no-repeat
//   `,
//   minHeight: "100vh",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "60px",
//   fontFamily: "Poppins, sans-serif",
//   position: "relative",
// };

// const glassStyle = {
//   //  backdropFilter: "blur(10px)",
//   backgroundColor: "rgba(255, 255, 255, 0.6)",
//   borderRadius: "45px",
//   padding: "55px",
//   boxShadow: "0 5px 15px rgba(100, 41, 41, 0.1)",
//   textAlign: "center",
//   marginTop: "-1000px", // Pull up to overlap with image
// };

// const cardStyle = {
//   p: 3,
//   borderRadius: "45px",
//   textAlign: "center",
//   transition: "0.3s",
//   background: "rgba(255, 255, 255, 0.8)",
//   boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//   color: "#1565C0",
//    marginTop: "200px",
//   fontFamily: "Poppins, sans-serif",
//   "&:hover": { 
//     transform: "scale(1.05)", 
//     boxShadow: "0px 5px 20px rgba(0,0,0,0.15)",
//     background: "rgb(228, 241, 241)",
//   },
// };

// const Home = () => {
//   return (
//     <Box sx={backgroundStyle}>
    
//       <Container maxWidth="lg">
//         {/* Top Image Section */}
//         <Box sx={{ 
//           textAlign: "center", 
//           mb: 4,
//           position: "relative",
//           zIndex: 1
//         }}>
         
//         </Box>

//         {/* <Paper  sx={glassStyle}>
//           <Typography variant="h4" gutterBottom sx={{ 
//             fontWeight: "bold", 
//             color: "#1565C0",
//             textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
//           }}>
//             Services Management System
//           </Typography>
//           <Typography variant="subtitle1" sx={{ 
//             color: "#333",
//             fontSize: "1.1rem",
//             mb: 2
//           }}>
//             Explore top colleges and courses for your future!
//           </Typography>
//         </Paper> */}

//         <Grid container spacing={4} sx={{ mt: 2}}>
//           <Grid item xs={12} md={6}>
//             <Paper elevation={4} sx={cardStyle}>
//               <Box sx={{ 
//                 display: "flex", 
//                 justifyContent: "center", 
//                 alignItems: "center", 
//                 mb: 2,
//                 "& svg": {
//                   filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
//                 }
//               }}>
//                 <SchoolIcon sx={{ fontSize: 50, color: "#64B5F6" }} />
//               </Box>
//               <Typography variant="h5" sx={{ 
//                 fontWeight: "bold",
//                 mb: 2
//               }}>
//                 Colleges
//               </Typography>
//               <Typography paragraph sx={{ color: "#444" }}>
//                 Discover various colleges and their admission details.
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 component={Link} 
//                 to="/colleges" 
//                 startIcon={<SchoolIcon />} 
//                 sx={{ 
//                   mt: 2, 
//                   backgroundColor: "#64B5F6",
//                   "&:hover": {
//                     backgroundColor: "#42A5F5",
//                     boxShadow: "0 3px 10px rgba(100, 181, 246, 0.4)"
//                   }
//                 }}
//               >
//                 Browse Colleges
//               </Button>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper elevation={4} sx={cardStyle}>
//               <Box sx={{ 
//                 display: "flex", 
//                 justifyContent: "center", 
//                 alignItems: "center", 
//                 mb: 2,
//                 "& svg": {
//                   filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
//                 }
//               }}>
//                 <BookIcon sx={{ fontSize: 50, color: "#64B5F6" }} />
//               </Box>
//               <Typography variant="h5" sx={{ 
//                 fontWeight: "bold",
//                 mb: 2
//               }}>
//                 Courses
//               </Typography>
//               <Typography paragraph sx={{ color: "#444" }}>
//                 Explore available courses and enrollment options.
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 component={Link} 
//                 to="/courses" 
//                 startIcon={<BookIcon />} 
//                 sx={{ 
//                   mt: 2, 
//                   backgroundColor: "#64B5F6",
//                   "&:hover": {
//                     backgroundColor: "#42A5F5",
//                     boxShadow: "0 3px 10px rgba(100, 181, 246, 0.4)"
//                   }
//                 }}
//               >
//                 View Courses
//               </Button>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default Home; src={`/carousel${idx}.jpg`}
import { Container, Paper, Box, Button, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { useState } from "react";
import "@fontsource/poppins";
import styled from "@emotion/styled";

// MU-inspired color scheme
const MU_BLUE = "#001a3a";
const MU_GOLD = "#ffb300";

// Marquee Styling
const MarqueeContent = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1000;

  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  span.dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: ${MU_GOLD};
    border-radius: 50%;
    margin: 0 20px;
    vertical-align: middle;
  }
`;

// Background Style
const backgroundStyle = {
  background: `
    linear-gradient(rgba(0, 26, 58, 0.8), rgba(0, 26, 58, 0.8)),
    url('https://www.manipal.edu/content/dam/manipal/mu/About-Us/rankings-accreditations/ranking-banner.jpg')
    center/cover fixed no-repeat
  `,
  minHeight: "100vh",
  fontFamily: "Poppins, sans-serif",
  position: "relative",
};

// Card Style
const cardStyle = {
  p: 4,
  borderRadius: "15px",
  textAlign: "center",
  transition: "0.3s",
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
  color: MU_BLUE,
  fontFamily: "Poppins, sans-serif",
  border: `2px solid ${MU_BLUE}`,
  "&:hover": { 
    transform: "scale(1.03)", 
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    borderColor: MU_GOLD,
  },
};

// Carousel Images
const carouselImages = [
  "/images/carousel0.jpg",
  "/images/carousel1.jpg",
  "/images/carousel2.jpg"
];

const Home = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Box sx={backgroundStyle}>
      {/* Carousel Container with Marquee */}
      <Box sx={{ position: 'relative' }}>
        <MarqueeContent>
          Admission Open 2025 - 2026 <span className="dot"></span> Medicine  
          <span className="dot"></span> Paramedical  <span className="dot"></span> Pharmacy  
          <span className="dot"></span> Nursing  <span className="dot"></span> Law  
          <span className="dot"></span> Aviation <span className="dot"></span> Arts & Science 
          <span className="dot"></span> Engineering <span className="dot"></span> Architecture 
          <span className="dot"></span> MBA / MCA <span className="dot"></span> Allied Health Sciences 
          <span className="dot"></span> Physiotheraphy <span className="dot"></span> School Of Design 
          <span className="dot"></span> International School
        </MarqueeContent>

        <Carousel 
          activeIndex={index} 
          onSelect={handleSelect}
          interval={3000}
          pause={false}
          style={{ 
            width: '100%', 
            height: '60vh',
            overflow: 'hidden'
          }}
        >
          {carouselImages.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={carouselImages[idx]} 
                alt={`Slide ${idx + 1}`}
                style={{ 
                  height: '60vh', 
                  objectFit: 'cover',
                  filter: 'brightness(0.7)'
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Box>

      {/* Main Content */}
      <Container sx={{ py:2}}>
        <Grid container spacing={10} paddingLeft={10}>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={cardStyle}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                
                "& svg": {
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }
              }}>
                <SchoolIcon sx={{ fontSize: 50, color: MU_BLUE }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: "700",
                mb: 2,
                color: MU_BLUE
              }}>
                Colleges
              </Typography>
              <Typography paragraph sx={{ color: "#444", fontSize: '1rem' }}>
                Discover various colleges and their admission details
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/colleges"
                sx={{ 
                  mt: 2, 
                  backgroundColor: MU_BLUE,
                  fontWeight: '600',
                  "&:hover": {
                    backgroundColor: MU_GOLD,
                    color: MU_BLUE,
                    boxShadow: `0 3px 10px ${MU_GOLD}80`
                  }
                }}
              >
                Browse Colleges
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={cardStyle}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
               
               
                "& svg": {
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }
              }}>
                <BookIcon sx={{ fontSize: 50, color: MU_BLUE }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: "700",
                mb: 2,
                color: MU_BLUE
              }}>
                Courses
              </Typography>
              <Typography paragraph sx={{ color: "#444", fontSize: '1rem' }}>
                Explore available courses and enrollment options
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/courses"
                sx={{ 
                  mt: 2, 
                  backgroundColor: MU_BLUE,
                  fontWeight: '600',
                  "&:hover": {
                    backgroundColor: MU_GOLD,
                    color: MU_BLUE,
                    boxShadow: `0 3px 10px ${MU_GOLD}80`
                  }
                }}
              >
                View Courses
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      {/* <Box sx={{ 
        background: MU_BLUE,
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.9rem',
        borderTop: `2px solid ${MU_GOLD}`
      }}>
        © 2024 Services Management System. All rights reserved.
      </Box> */}
    </Box>
  );
};

export default Home;