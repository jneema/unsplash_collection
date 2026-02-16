import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.log("NETWORK ERROR DETAIL:", {
      message: error.message,
      code: error.code,
      config: error.config.url,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);


export default api;
