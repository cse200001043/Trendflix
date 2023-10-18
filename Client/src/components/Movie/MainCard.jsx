import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoviesCard from "./MoviesCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const MainCard = ({ movieDetails, heading }) => {
  const navigate = useNavigate();
  const chunkSize = 5;

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const movieChunks = chunkArray(movieDetails, chunkSize);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "white",
          mt: 3,
          ml: 4,
          fontFamily: "Roboto",
          fontWeight: "500",
          fontSize: "1.4em",
        }}
      >
        {heading}
      </Typography>
      <Box sx={{ mr: 2, ml: 2, mb: 2, mt: 0, backgroundColor: "#00050D" }}>
        <Carousel showStatus={false} infiniteLoop={true}>
          {movieChunks?.map((chunk, index) => (
            <div key={index} style={{ display: "flex" }}>
              {chunk?.map((movie, i) => (
                <Box
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.10)",
                      boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                    },
                  }}
                  onClick={() => {
                    navigate(`/movie/${movie.name}`, {
                      state: { data: movie },
                    });
                  }}
                >
                  <MoviesCard item={movie} key={i} />
                </Box>
              ))}
            </div>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default MainCard;
