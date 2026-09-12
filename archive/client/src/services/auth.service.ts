import authApi from "./api";
import { useAuth } from "../../context/AuthContext";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "supplier" | "admin";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await authApi().post("/auth/login", data);
  const { token, user } = response.data;

  // Store token in localStorage for future requests
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }

  return { token, user };
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await authApi().post("/auth/register", data);
  const { token, user } = response.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }

  return { token, user };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await authApi().get("/auth/me");
  return response.data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};