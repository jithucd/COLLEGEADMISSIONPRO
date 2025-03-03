import { Container, Paper, Box, Button, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import { Link } from "react-router-dom";
import "@fontsource/poppins";

const backgroundStyle = {
  background: `
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg')
    center/cover fixed no-repeat
  `,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px",
  fontFamily: "Poppins, sans-serif",
  position: "relative",
};

const glassStyle = {
  //  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  borderRadius: "45px",
  padding: "55px",
  boxShadow: "0 5px 15px rgba(100, 41, 41, 0.1)",
  textAlign: "center",
  marginTop: "-1000px", // Pull up to overlap with image
};

const cardStyle = {
  p: 3,
  borderRadius: "45px",
  textAlign: "center",
  transition: "0.3s",
  background: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  color: "#1565C0",
   marginTop: "200px",
  fontFamily: "Poppins, sans-serif",
  "&:hover": { 
    transform: "scale(1.05)", 
    boxShadow: "0px 5px 20px rgba(0,0,0,0.15)",
    background: "rgb(228, 241, 241)",
  },
};

const Home = () => {
  return (
    <Box sx={backgroundStyle}>
      
      <Container maxWidth="lg">
        {/* Top Image Section */}
        <Box sx={{ 
          textAlign: "center", 
          mb: 4,
          position: "relative",
          zIndex: 1
        }}>
         
        </Box>

        {/* <Paper  sx={glassStyle}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: "bold", 
            color: "#1565C0",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}>
            Services Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: "#333",
            fontSize: "1.1rem",
            mb: 2
          }}>
            Explore top colleges and courses for your future!
          </Typography>
        </Paper> */}

        <Grid container spacing={4} sx={{ mt: 2}}>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={cardStyle}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                mb: 2,
                "& svg": {
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }
              }}>
                <SchoolIcon sx={{ fontSize: 50, color: "#64B5F6" }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: "bold",
                mb: 2
              }}>
                Colleges
              </Typography>
              <Typography paragraph sx={{ color: "#444" }}>
                Discover various colleges and their admission details.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/colleges" 
                startIcon={<SchoolIcon />} 
                sx={{ 
                  mt: 2, 
                  backgroundColor: "#64B5F6",
                  "&:hover": {
                    backgroundColor: "#42A5F5",
                    boxShadow: "0 3px 10px rgba(100, 181, 246, 0.4)"
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
                mb: 2,
                "& svg": {
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }
              }}>
                <BookIcon sx={{ fontSize: 50, color: "#64B5F6" }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: "bold",
                mb: 2
              }}>
                Courses
              </Typography>
              <Typography paragraph sx={{ color: "#444" }}>
                Explore available courses and enrollment options.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/courses" 
                startIcon={<BookIcon />} 
                sx={{ 
                  mt: 2, 
                  backgroundColor: "#64B5F6",
                  "&:hover": {
                    backgroundColor: "#42A5F5",
                    boxShadow: "0 3px 10px rgba(100, 181, 246, 0.4)"
                  }
                }}
              >
                View Courses
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;