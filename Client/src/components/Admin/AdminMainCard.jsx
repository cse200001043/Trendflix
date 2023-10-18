import React from "react";
import { Box, Typography } from "@mui/material";
import AdminMoviesCard from "./AdminMoviesCard";

const AdminMainCard = ({ movieDetails, heading, setMoviesList }) => {
  const chunkSize = 5;

  const ChunkedMovieDetails = () => {
    const chunkArray = (array, showinchunkSizegCount) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const movieChunks = chunkArray(movieDetails, 5);

    return (
      <>
        {movieChunks.map((chunk, index) => (
          <div key={index} style={{ display: "flex" }}>
            {chunk.map((movie, i) => (
              <Box
                sx={{
                  cursor: "pointer",
                  transition: "transform 0s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <AdminMoviesCard
                  item={movie}
                  key={i}
                  setMoviesList={setMoviesList}
                />
              </Box>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ ml: 14, mr: 14 }}>
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
        {ChunkedMovieDetails()}
      </Box>
    </Box>
  );
};

export default AdminMainCard;
