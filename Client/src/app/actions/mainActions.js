import { apiCall, datamindCall } from "../../api";
import { ENDPOINTS } from "../../constants/AppConstants";
import { openAlertMessage } from "./alertActions";
import { setUserDetails } from "./authActions";

export const mainActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const getMainActions = (dispatch) => {
  return {
    addInitialDetails: (userDetails, navigate) =>
      dispatch(addInitialDetails(userDetails, navigate)),
    addToFavourites: (
      userDetails,
      setIsFavourite,
      isFavourite,
      setIsDisabled
    ) =>
      dispatch(
        addToFavourites(userDetails, setIsFavourite, isFavourite, setIsDisabled)
      ),
    addToPreviouslyWatched: (userDetails, setIsFavourite) =>
      dispatch(addToPreviouslyWatched(userDetails, setIsFavourite)),
    getRecommendedMovies: (
      userDetails,
      setMoviesList,
      setIsLoading,
      setCarouselDetails
    ) =>
      dispatch(
        getRecommendedMovies(
          userDetails,
          setMoviesList,
          setIsLoading,
          setCarouselDetails
        )
      ),
    getHomeMovies: (setMoviesList, setIsLoading, setCarouselDetails) =>
      dispatch(getHomeMovies(setMoviesList, setIsLoading, setCarouselDetails)),
    getMovieDetails: (
      movieId,
      setMovieDetails,
      setMoviesList,
      setIsMovieDetails
    ) =>
      dispatch(
        getMovieDetails(
          movieId,
          setMovieDetails,
          setMoviesList,
          setIsMovieDetails
        )
      ),
    getIsFavouriteMovie: (movieId, setIsFavourite, setIsMovieFavourite) =>
      dispatch(
        getIsFavouriteMovie(movieId, setIsFavourite, setIsMovieFavourite)
      ),
    getLikedMovies: (userId, setMoviesList, setIsLoading) =>
      dispatch(getLikedMovies(userId, setMoviesList, setIsLoading)),
    changeData: () => dispatch(changeData()),
    searchMovie: (movieName, navigate) =>
      dispatch(searchMovie(movieName, navigate)),
    searchGenre: (genre, navigate) => dispatch(searchGenre(genre, navigate)),
    getAmazonProducts: (data, setAmazonProducts) => dispatch(getAmazonProducts(data, setAmazonProducts))
  };
};

const addInitialDetails = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await apiCall(
      userDetails,
      ENDPOINTS.ADD_INITIAL_DETAILS,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      const response2 = await datamindCall({}, ENDPOINTS.CHANGE_DATA, "GET");
      if (!response2) {
        dispatch(openAlertMessage("Some error occurred"));
      } else {
        if (userDetails.age) {
          navigate("/");
        } else {
          navigate("/initialDetails");
        }
      }
    }
  };
};

const addToFavourites = (
  userDetails,
  setIsFavourite,
  isFavourite,
  setIsDisabled
) => {
  return async (dispatch) => {
    const response = await apiCall(
      userDetails,
      ENDPOINTS.ADD_TO_FAVOURITES,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { success } = response?.data;
      if (success) {
        setIsFavourite(!isFavourite);
        setIsDisabled(false);
        dispatch(changeData());
      }
    }
  };
};

const addToPreviouslyWatched = (userDetails) => {
  return async (dispatch) => {
    const response = await apiCall(
      userDetails,
      ENDPOINTS.ADD_TO_PREVIOUSLY_WATCHED,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { success } = response?.data;
      if (success) {
        dispatch(changeData());
        const movieId = {
          movie_id: userDetails.movieId,
        };
        dispatch(incCount(movieId));
      }
    }
  };
};

// DataMind Calls

const getRecommendedMovies = (
  userId,
  setMoviesList,
  setIsLoading,
  setCarouselDetails
) => {
  return async (dispatch) => {
    const response = await datamindCall(
      userId,
      ENDPOINTS.GET_RECOMMENDED_MOVIES,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      setMoviesList(response?.data?.data);
      setIsLoading(false);
      const popularMovies = response?.data?.data[2]?.data;
      const randomElements = [];

      while (randomElements.length < 5) {
        const randomIndex = Math.floor(Math.random() * popularMovies?.length);
        const randomElement = popularMovies[randomIndex];
        if (!randomElements.includes(randomElement)) {
          randomElements.push(randomElement);
        }
        if (randomElements.length === popularMovies.length) {
          break;
        }
      }
      setCarouselDetails(randomElements);
    }
  };
};

const getHomeMovies = (setMoviesList, setIsLoading, setCarouselDetails) => {
  return async (dispatch) => {
    const response = await datamindCall({}, ENDPOINTS.GET_HOME_MOVIES, "GET");
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      setMoviesList(response?.data?.data);
      setIsLoading(false);
      const popularMovies = response?.data?.data[0]?.data;
      const randomElements = [];

      while (randomElements.length < 5) {
        const randomIndex = Math.floor(Math.random() * popularMovies?.length);
        const randomElement = popularMovies[randomIndex];
        if (!randomElements.includes(randomElement)) {
          randomElements.push(randomElement);
        }
        if (randomElements.length === popularMovies.length) {
          break;
        }
      }
      setCarouselDetails(randomElements);
    }
  };
};

const getMovieDetails = (
  movieId,
  setMovieData,
  setMoviesList,
  setIsMovieDetails
) => {
  return async (dispatch) => {
    const response = await datamindCall(
      movieId,
      ENDPOINTS.GET_MOVIE_DETAILS,
      "POST"
    );
    if (response.error) {
      dispatch(
        openAlertMessage("Some Error Occurred. Please try again later!")
      );
    } else {
      setMovieData(response?.data?.movie_data[0]);
      setMoviesList(response?.data?.recommended);
      setIsMovieDetails(true);
    }
  };
};

const getIsFavouriteMovie = (movieId, setIsFavourite, setIsMovieFavourite) => {
  return async (dispatch) => {
    const response = await apiCall(movieId, ENDPOINTS.GET_IS_FAVOURITE, "POST");
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      console.log("response", response);
      setIsFavourite(response?.data?.isFavourite);
      setIsMovieFavourite(true);
    }
  };
};

const getLikedMovies = (userId, setMoviesList, setIsLoading) => {
  return async (dispatch) => {
    const response = await datamindCall(
      userId,
      ENDPOINTS.GET_LIKED_MOVIES,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage("Some Error Occurred!"));
    } else {
      setMoviesList(response?.data?.liked_movies?.data);
      setIsLoading(false);
    }
  };
};

const changeData = () => {
  return async (dispatch) => {
    const response = await datamindCall({}, ENDPOINTS.CHANGE_DATA, "GET");
    if (!response) {
      dispatch(openAlertMessage("Some error occurred"));
      return false;
    } else {
      return true;
    }
  };
};

const incCount = (movieId) => {
  return async (dispatch) => {
    const response = await datamindCall(
      movieId,
      ENDPOINTS.INCREASE_COUNT,
      "POST"
    );
    if (response.error) {
      dispatch(openAlertMessage("Some error occurred"));
    } else {
      const { success } = response?.data;
    }
  };
};

const searchMovie = (movieName, navigate) => {
  return async (dispatch) => {
    const response = await datamindCall(movieName, ENDPOINTS.SEARCH, "POST");
    if (response.error) {
      dispatch(openAlertMessage("Some error occurred"));
    } else {
      navigate(`/search/${movieName.movie_name}`, {
        state: { data: response?.data?.movie_data },
      });
    }
  };
};

const searchGenre = (genre, navigate) => {
  return async (dispatch) => {
    const response = await datamindCall(genre, ENDPOINTS.SEARCH_GENRE, "POST");
    if (response.error) {
      dispatch(openAlertMessage("Some error occurred"));
    } else {
      navigate(`/search/${genre.category}`, {
        state: { data: response?.data?.movie_data },
      });
    }
  };
};

const getAmazonProducts = (data, setAmazonProducts) => {
  return async (dispatch) => {
    const response = await datamindCall(data, ENDPOINTS.GET_AMAZON_PRODUCTS, "POST");
    if (response.error) {
      dispatch(openAlertMessage("Some error occurred"));
    } else {
      console.log('response', response.data)
      setAmazonProducts(response?.data?.productLinks)
    }
  };
};
