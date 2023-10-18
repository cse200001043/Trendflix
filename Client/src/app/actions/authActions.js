import { apiCall, datamindCall } from "../../api";
import { ENDPOINTS } from "../../constants/AppConstants";
import { openAlertMessage } from "./alertActions";

export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const setUserDetails = (userDetails) => {
  console.log("Auth action", userDetails);
  return {
    type: authActions.SET_USER_DETAILS,
    userDetails,
  };
};

export const getAuthActions = (dispatch) => {
  return {
    login: (userDetails, navigate) => dispatch(login(userDetails, navigate)),
    register: (userDetails, navigate) =>
      dispatch(register(userDetails, navigate)),
    requestPasswordReset: (userDetails, navigate) =>
      dispatch(requestPasswordReset(userDetails, navigate)),
    passwordReset: (userDetails, navigate) =>
      dispatch(passwordReset(userDetails, navigate)),
    setUserDetails: (userDetails) => dispatch(setUserDetails(userDetails)),
  };
};

export const login = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await apiCall(userDetails, ENDPOINTS.LOGIN, "POST");
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      if (userDetails.role === "admin") navigate("/admin/home");
      else if (userDetails.age) {
        navigate("/");
      } else {
        navigate("/initialDetails");
      }
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
    }
  };
};

export const register = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await apiCall(userDetails, ENDPOINTS.REGISTER, "POST");
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      await datamindCall({}, ENDPOINTS.CHANGE_DATA, "GET");
      if (userDetails.role === "admin") navigate("/admin/home");
      else if (userDetails.age) {
        navigate("/");
      } else {
        navigate("/initialDetails");
      }
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
    }
  };
};

export const requestPasswordReset = (userDetails, setMailStatus) => {
  return async (dispatch) => {
    const response = await apiCall(
      userDetails,
      ENDPOINTS.REQUEST_PASSWORD_RESET,
      "POST"
    );
    if (response.status !== 200) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      setMailStatus(true);
    }
  };
};

export const passwordReset = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await apiCall(
      userDetails,
      ENDPOINTS.PASSWORD_RESET,
      "POST"
    );
    if (response.status !== 200) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      dispatch(openAlertMessage("Password updated successfully"));
      navigate("/");
    }
  };
};
