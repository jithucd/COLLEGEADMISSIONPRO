import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const MAX_DESCRIPTION_LENGTH = 100;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const handleExpand = () => setExpanded(!expanded);

  return (
    <Card
      sx={{
        minHeight: "250px",
        maxHeight: "320px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mb: 2,
        position: "relative",
        borderRadius: "16px",
        backgroundColor: "rgba(242, 242, 243, 0.15)",
        backdropFilter: "blur(30px)",
        border: "3px solid rgba(19, 1, 1, 0.2)",
        boxShadow: "0 6px 12px rgba(244, 246, 246, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(32, 2, 2, 0.2)",
        },
      }}
    >
      {isFavoriting && (
        <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      )}

      <CardContent>
        {/* Course Title and Fees */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: "black" }}>
            {course.title || "Unknown Course"}
          </Typography>
          <Chip
            label={`₹${course.fees?.toLocaleString() || "N/A"}`}
            color="success"
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Course Description with "Read More" */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: expanded ? "unset" : 3,
            transition: "all 0.3s ease",
          }}
        >
          {expanded
            ? course.description || "No description available"
            : (course.description || "No description available").slice(
                0,
                MAX_DESCRIPTION_LENGTH
              )}
          {course.description?.length > MAX_DESCRIPTION_LENGTH && (
            <Button
              size="small"
              onClick={handleExpand}
              sx={{
                ml: 1,
                color: "blue",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {expanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </Typography>

        {/* Course College and Duration - Separate Lines */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Box>
            <Chip
              icon={<SchoolIcon fontSize="small" />}
              label={course.college?.name || "Unknown College"}
              size="small"
              variant="outlined"
            />
          </Box>
          <Box>
            <Chip label={`Duration: ${course.duration}`} size="small" color="info" />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to={`/admission/${course._id}`}
            size="small"
            sx={{
              backgroundColor: "#27ae60",
              "&:hover": {
                backgroundColor: "#219653",
              },
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            Apply Now
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddToFavorites}
            disabled={isFavoriting}
            startIcon={
              isFavoriting ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )
            }
            size="small"
            sx={{
              borderRadius: "8px",
              fontWeight: 500,
              color: "blue",
              borderColor: "#2c3e50",
              "&:hover": {
                backgroundColor: "rgba(134, 219, 241, 0.4)",
              },
            }}
          >
            {isFavoriting ? "Adding..." : "Add to Favorites"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
