import axios from "axios";

const api = axios.create({
  baseURL: "https://dutch-anjela-my-org-org-f52e9afe.koyeb.app",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("NETWORK ERROR DETAIL:", {
      message: error.message,
      code: error.code,
      config: error.config.url,
      response: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default api;
