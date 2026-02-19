import axios from "axios";
import { getAnonymousId } from "../utils/auth";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const anonId = await getAnonymousId();
    if (anonId) {
      config.headers["X-Anonymous-ID"] = anonId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("NETWORK ERROR DETAIL:", {
      message: error.message,
      code: error.code,
      config: error.config?.url,
      response: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default api;
