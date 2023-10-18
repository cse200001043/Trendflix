import React, { useEffect, useState } from "react";
import LikedMainCard from "./LikedMainCard";
import HomeNavbar from "../home/HomeNavbar";
import { connect, useSelector } from "react-redux";
import { getMainActions } from "../../app/actions/mainActions";
import { Box, CircularProgress } from "@mui/material";

const LikedMovies = ({ getLikedMovies }) => {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.userDetails);

  useEffect(() => {
    const userId = {
      user_id: user._id,
    };
    getLikedMovies(userId, setMoviesList, setIsLoading);
  }, []);

  return (
    <>
      <HomeNavbar />
      {!isLoading ? (
        <LikedMainCard movieDetails={moviesList} heading="Liked Movies" />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={50} color="primary" />
        </Box>
      )}
    </>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(LikedMovies);
