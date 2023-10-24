export const BASE_URL = "http://localhost:5000/";
export const BASE_URL_DATAMIND = "http://localhost:5001";

export const ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  REQUEST_PASSWORD_RESET: "/auth/requestPasswordReset",
  PASSWORD_RESET: "/auth/passwordReset",
  ADD_INITIAL_DETAILS: "/main/addInitialDetails",
  ADD_TO_FAVOURITES: "/main/addToFavourites",
  GET_RECOMMENDED_MOVIES: "/userid",
  ADD_TO_PREVIOUSLY_WATCHED: "/main/addToPreviouslyWatched",
  GET_ALL_MOVIES: "/all",
  GET_MOVIE_DETAILS: "/movieid",
  GET_IS_FAVOURITE: "/main/isFavourite",
  ADD_MOVIE: "/addmovie",
  GET_LIKED_MOVIES: "/liked",
  GET_HOME_MOVIES: "/home",
  CHANGE_DATA: "/change",
  INCREASE_COUNT: "/count",
  SEARCH: "/search",
  UPDATE_MOVIE: "/updatemovie",
  DELETE_MOVIE: "/deletemovie",
  SEARCH_GENRE: "/category",
  GET_AMAZON_PRODUCTS:"/amazon_products"
};
