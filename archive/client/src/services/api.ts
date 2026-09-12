import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api", timeout: 10000, headers: { "Content-Type": "application/json" } });
api.interceptors.request.use((config) => { const token = localStorage.getItem("token"); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const messageFromError = (error: unknown, fallback = "Something went wrong. Please try again.") => axios.isAxiosError(error) ? ((error.response?.data as { message?: string } | undefined)?.message ?? fallback) : fallback;
export default api;
