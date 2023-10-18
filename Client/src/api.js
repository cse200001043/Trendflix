import axios from "axios";
import { BASE_URL, BASE_URL_DATAMIND } from "./constants/AppConstants";
import { store } from ".";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const { userDetails } = store.getState().auth;
    console.log("userDetails", userDetails);

    if (userDetails) {
      const token = userDetails.token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiCall = async (data, endpoint, method) => {
  try {
    if (method === "GET") {
      return await apiClient.get(endpoint, data);
    } else if (method === "POST") {
      console.log("data", data);
      return await apiClient.post(endpoint, data);
    }
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

const apiClientDataMind = axios.create({
  baseURL: BASE_URL_DATAMIND,
});

export const datamindCall = async (data, endpoint, method) => {
  try {
    if (method === "GET") {
      return await apiClientDataMind.get(endpoint, data);
    } else if (method === "POST") {
      console.log("data", data);
      return await apiClientDataMind.post(endpoint, data);
    }
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};
