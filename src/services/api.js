import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("savitram_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("savitram_token");
      localStorage.removeItem("savitram_user");
      window.location.replace(window.location.origin + "/bhawishya-dwar/login");
    }
    return Promise.reject(error);
  }
);

export default api;
