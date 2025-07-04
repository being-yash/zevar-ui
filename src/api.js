import axios from "axios";

const BASE_URL = " https://5bc9-2402-8100-2732-a6a9-d006-7682-f7c3-a5ca.ngrok-free.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // <-- Add this line
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure the ngrok header is always present
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;