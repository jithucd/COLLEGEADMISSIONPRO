import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Move useNavigate inside the component
import { addToFavorites } from "../services/courses";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SchoolIcon from "@mui/icons-material/School";

const CourseCard = ({ course }) => {
  const navigate = useNavigate(); // ✅ Move useNavigate inside the component
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      setIsFavoriting(true);
      await addToFavorites(course._id, token);
      toast.success("Added to favorites!");
    } catch (error) {
      toast.error(error.message || "Failed to add to favorites");
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      {isFavoriting && (
        <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      )}

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="div">
            {course.title}
          </Typography>
          <Chip label={`₹${course.fees}`} color="success" size="small" variant="outlined" />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {course.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Chip icon={<SchoolIcon fontSize="small" />} label={course.college?.name || "Unknown College"} size="small" variant="outlined" />
          <Chip label={`Duration: ${course.duration}`} size="small" color="info" />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="contained" color="success" component={Link} to={`/admission/${course._id}`} size="small">
            Apply Now
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddToFavorites}
            disabled={isFavoriting}
            startIcon={isFavoriting ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            size="small"
          >
            {isFavoriting ? "Adding..." : "Add to Favorites"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
