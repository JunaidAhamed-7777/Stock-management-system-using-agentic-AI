export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "supplier" | "admin";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: "customer" | "supplier") => Promise<void>;
}

export interface LoginResponse {
  token: string;
  user: User;
}