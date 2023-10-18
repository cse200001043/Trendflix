import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import MoviePage from "./components/Movie/MoviePage";
import AdminHomePage from "./components/Admin/AdminHomePage";
import AddMovie from "./components/Admin/AddMovie";
import "./index.css";
import LikedMovies from "./components/Movie/LikedMovies";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import rootReducer from "./app/reducers/index.js";
import AlertNotification from "./shared/components/AlertNotification";
import HomePage from "./components/home/HomePage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import InitialDetails from "./components/InitialDetails";
import EditMovie from "./components/Admin/EditMovie";
import SearchMoviesPage from "./shared/components/SearchMoviesPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore(
  {
    reducer: persistedReducer,
  },
  composeWithDevTools(applyMiddleware(thunk))
);
const persistor = persistStore(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/passwordReset",
    element: <ResetPassword />,
  },
  {
    path: "/initialDetails",
    element: <InitialDetails />,
  },
  {
    path: "/movie/:movieName",
    element: <MoviePage />,
  },
  {
    path: "/favourites",
    element: <LikedMovies />,
  },
  {
    path: "/admin/home",
    element: <AdminHomePage />,
  },
  {
    path: "/admin/addMovie",
    element: <AddMovie />,
  },
  {
    path: "/admin/editMovie",
    element: <EditMovie />,
  },
  {
    path: "/search/:searchedValue",
    element: <SearchMoviesPage />,
  },
]);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router}></RouterProvider>
      <AlertNotification />
    </PersistGate>
  </Provider>
);
