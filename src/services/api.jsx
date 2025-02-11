import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Interceptor para agregar el token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Asegurar que el token esté guardado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
