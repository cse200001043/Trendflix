import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../home/HomeNavbar";
import Cast from "./Cast";
import Trailer from "./Trailer";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import MainCard from "./MainCard";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { CircularProgress, Typography, Box, IconButton } from "@mui/material";
import { connect, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { getAuthActions } from "../../app/actions/authActions";
import { getMainActions } from "../../app/actions/mainActions";
import { getActions } from "../../app/actions/alertActions";
import { getAdminActions } from "../../app/actions/adminActions";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#05031a",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const MoviePage = ({
  setUserDetails,
  addToFavourites,
  addToPreviouslyWatched,
  openAlertMessage,
  getMovieDetails,
  getIsFavouriteMovie,
}) => {
  const location = useLocation();
  const { movieName } = useParams();
  const [movieData, setMovieData] = useState([]);
  const [moviesList, setMoviesList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [genres, setGenres] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
  };

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isFavourite, setIsFavourite] = React.useState(false);
  const [isMovieDetails, setIsMovieDetails] = useState(false);
  const [isMovieFavourite, setIsMovieFavourite] = useState(false);
  const user = useSelector((state) => state.auth.userDetails);
  const navigate = useNavigate();
  const search = useLocation().search;
  useEffect(() => {
    const token = new URLSearchParams(search).get("user");
    if (token) {
      const data = jwt_decode(token).user;
      setIsLoggedIn(true);
      setUserDetails(data);
      navigate("/");
    }
    console.log("home", user);
    if (user) {
      setIsLoggedIn(true);
    }
    const movieId = {
      movie_id: location.state.data.movie_id,
    };
    getMovieDetails(movieId, setMovieData, setMoviesList, setIsMovieDetails);
  }, [movieName]);

  useEffect(() => {
    let genres = "";
    movieData?.genre?.forEach((element) => {
      genres += element + ", ";
    });
    genres = genres?.substring(0, genres.length - 2);
    setGenres(genres);

    if (user) {
      const movieId = {
        movieId: movieData.movie_id,
      };
      getIsFavouriteMovie(movieId, setIsFavourite, setIsMovieFavourite);
    } else {
      setIsMovieFavourite(true);
    }
    window.scrollTo(0, 0);
  }, [movieData]);

  const handleAddToFavourites = () => {
    // Add To Favourites
    const details = {
      isFavourite: !isFavourite,
      movieId: movieData.movie_id,
    };
    setIsDisabled(true);
    addToFavourites(details, setIsFavourite, isFavourite, setIsDisabled);
  };

  const handleOpen = () => {
    // Add To Previously Watched
    if (!isLoggedIn) {
      openAlertMessage("Please Login To Watch.");
    } else {
      setOpen(true);
      if (user?.role === "user") {
        const details = {
          movieId: movieData.movie_id,
        };
        addToPreviouslyWatched(details, setIsFavourite);
      }
    }
  };

  const convertTime = (runtimeInMinutes) => {
    const hours = Math.floor(runtimeInMinutes / 60);
    const minutes = runtimeInMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <HomeNavbar />
      {isMovieDetails && isMovieFavourite ? (
        <>
          <div style={{ backgroundColor: "white" }}>
            <div
              style={{
                display: "flex",
                padding: "30px 40px",
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3)), url(${movieData.background_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div>
                <img
                  src={movieData.poster_image}
                  alt={movieData.movie_title}
                  style={{ width: "300px", height: "450px" }}
                />
              </div>
              <div style={{ padding: "40px 10px 40px 40px" }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontFamily: "'Source Sans Pro', Arial, sans-serif",
                    fontSize: "35.2px",
                    fontWeight: "bold",
                  }}
                >
                  {movieData.movie_title}
                  {" ("}
                  {movieData.release_date?.substring(0, 4)}
                  {")"}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontFamily: "'Source Sans Pro', Arial, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {movieData.release_date}
                  {" (US) "}
                  {" | "}
                  {genres} {" | "}
                  {convertTime(movieData.runtime)}
                </Typography>
                <div style={{ display: "flex" }}>
                  <Box
                    position="relative"
                    sx={{ mt: 3, ml: 1 }}
                    display="inline-flex"
                  >
                    <CircularProgress
                      variant="determinate"
                      value={movieData.rating * 10}
                      size={55}
                      thickness={3}
                      sx={{
                        color: "#44cf69",
                        border: "4px solid #05031a",
                        backgroundColor: "#05031a",
                        borderRadius: "100%",
                      }}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="h5"
                        style={{ color: "white", fontWeight: "bold" }}
                        component="div"
                        color="textSecondary"
                      >
                        {parseInt(movieData.rating * 10)}
                        <sup style={{ fontSize: "10px" }}>%</sup>
                      </Typography>
                    </Box>
                  </Box>
                  <div>
                    {user?.role === "admin" ? (
                      <></>
                    ) : (
                      <Box
                        position="relative"
                        sx={{ mt: 3.5, ml: 2, cursor: "pointer" }}
                        display="inline-flex"
                      >
                        <BootstrapTooltip
                          title={
                            isLoggedIn
                              ? "Add to favourites"
                              : "Login to add this movie to your favourite list"
                          }
                          placement="bottom"
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              width: "45px",
                              height: "45px",
                              borderRadius: "100%",
                              backgroundColor: "#05031a",
                            }}
                          >
                            <IconButton
                              size="large"
                              aria-label="account of current user"
                              aria-controls="primary-search-account-menu"
                              aria-haspopup="true"
                              color="white"
                              disabled={
                                isLoggedIn && !isDisabled ? false : true
                              }
                              onClick={handleAddToFavourites}
                            >
                              <FavoriteIcon
                                sx={{
                                  color: isFavourite ? "red" : "white",
                                  fontSize: "18px",
                                }}
                              />
                            </IconButton>
                          </div>
                        </BootstrapTooltip>
                      </Box>
                    )}
                  </div>
                  <Box
                    position="relative"
                    sx={{
                      mt: 4.3,
                      ml: 2,
                      color: "white",
                      fontSize: "17px",
                      fontWeight: "600",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#97dedb",
                      },
                    }}
                  >
                    <div style={{ display: "flex" }} onClick={handleOpen}>
                      <PlayArrowIcon sx={{ fontSize: "30px", mr: 1 }} /> Play
                      Trailer
                    </div>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Box
                          sx={{
                            backgroundColor: "black",
                            color: "white",
                            px: 2,
                            py: 1,
                          }}
                          id="modal-modal-title"
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h6" component="h2">
                             Play Trailer 
                            </Typography>
                            <div>
                              <IconButton
                                sx={{ color: "white" }}
                                aria-label="Delete"
                                onClick={handleClose}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          </div>
                        </Box>
                        <Trailer trailerLink={movieData.trailer} />
                      </Box>
                    </Modal>
                  </Box>
                </div>
                <Box sx={{ mt: 3, ml: 1, color: "#97dedb" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: "1.2em", fontStyle: "italic" }}
                  >
                    {movieData.tagline}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, ml: 1, color: "white" }}>
                  <Typography variant="h5" sx={{ fontSize: "1.4em" }}>
                    Overview
                  </Typography>
                </Box>
                <Box sx={{ mt: 1.3, ml: 1, color: "white" }}>
                  <Typography variant="h5" sx={{ fontSize: "0.9em" }}>
                    {movieData.overview}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, ml: 1, color: "white" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: "1.25em", fontWeight: "bold" }}
                  >
                    Director
                  </Typography>
                </Box>
                <Box sx={{ mt: 0, ml: 1, color: "white" }}>
                  <Typography variant="h5" sx={{ fontSize: "1em" }}>
                    {movieData.Director}
                  </Typography>
                </Box>
              </div>
            </div>
            <Cast castDetails={movieData?.Cast} />
            <Box sx={{ backgroundColor: "black", px: 12, pt: 0.5 }}>
              <MainCard
                movieDetails={moviesList}
                heading="Recommended Movies"
              />
            </Box>
          </div>
        </>
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
    ...getAuthActions(dispatch),
    ...getMainActions(dispatch),
    ...getActions(dispatch),
    ...getAdminActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(MoviePage);
