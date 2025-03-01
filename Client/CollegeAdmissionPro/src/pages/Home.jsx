import { Container, Grid, Paper, Box, Button, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to the College Management System
        </Typography>
        <Typography variant="subtitle1">
          Explore colleges and courses!
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5">Colleges</Typography>
            </Box>
            <Typography paragraph>
              Discover various colleges and their admission details
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/colleges"
              startIcon={<SchoolIcon />}
            >
              Browse Colleges
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5">Courses</Typography>
            </Box>
            <Typography paragraph>
              Explore available courses and enrollment options
            </Typography>
            <Button
              variant="contained"
              color="success"
              component={Link}
              to="/courses"
              startIcon={<BookIcon />}
            >
              View Courses
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;