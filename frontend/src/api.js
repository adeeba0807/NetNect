import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9090";

const api = axios.create({
  baseURL: API_URL,
});

export default api;