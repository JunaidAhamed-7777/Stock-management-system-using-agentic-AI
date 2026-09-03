import axios, { AxiosInstance, AxiosError } from "axios";

let api: AxiosInstance;

const getApi = (): AxiosInstance => {
  if (!api) {
    api = axios.create({
      baseURL: "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor - handle errors consistently
    api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 - unauthorized / token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.warn("Unauthorized - token may have expired");
        }

        // Handle 403 - forbidden
        if (error.response?.status === 403) {
          console.warn("Forbidden - insufficient permissions");
        }

        // Handle 404 - not found
        if (error.response?.status === 404) {
          console.warn("Not found - endpoint or resource may not exist");
        }

        // Handle network errors
        if (!error.response) {
          console.error("Network error - unable to reach server");
        }

        return Promise.reject(error);
      }
    );
  }

  return api;
};

export default getApi;