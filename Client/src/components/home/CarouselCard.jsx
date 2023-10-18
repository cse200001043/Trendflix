import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const CarouselCard = ({ movieDetails }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "310px",
        display: "flex",
        borderRadius: "10px",
      }}
    >
      <Box sx={{ width: "30%", color: "white" }}>
        <Typography
          variant="h4"
          sx={{
            mt: 5,
            fontFamily: "'Dancing Script'",
            fontSize: "3em",
            fontWeight: "bold",
          }}
        >
          {movieDetails?.name}
        </Typography>
        <Button
          sx={{
            mt: 5,
            color: "white",
            backgroundColor: "black",
            height: "50px",
            borderRadius: "10px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            },
          }}
          variant="outlined"
          size="large"
          onClick={() => {
            navigate(`/movie/${movieDetails.name}`, {
              state: { data: movieDetails },
            });
          }}
        >
          See Details
        </Button>
      </Box>
      <Box
        style={{
          width: "70%",
          textAlign: "right",
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${movieDetails?.image})`,
          backgroundSize: "cover",
          borderRadius: "10px",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
    </Box>
  );
};

export default CarouselCard;
