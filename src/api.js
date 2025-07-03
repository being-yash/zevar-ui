import axios from "axios";

const BASE_URL = "https://c5b5-2402-8100-2735-31b6-45b2-5da3-69e9-5d4f.ngrok-free.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add an interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;