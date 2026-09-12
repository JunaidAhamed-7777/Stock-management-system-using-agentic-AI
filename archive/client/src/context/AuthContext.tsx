import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../services/api";
export type Role = "admin" | "supplier" | "customer";
export interface User { id: number; name: string; email: string; role: string }
interface AuthValue { user: User | null; isLoading: boolean; login(email: string, password: string): Promise<User>; register(name: string, email: string, password: string): Promise<User>; logout(): void }
const AuthContext = createContext<AuthValue | undefined>(undefined);
export const roleOf = (role: string): Role => role.toLowerCase() as Role;
export function AuthProvider({ children }: { children: ReactNode }) { const [user, setUser] = useState<User | null>(null); const [isLoading, setLoading] = useState(true); useEffect(() => { api.get<User>("/auth/me").then(r => setUser(r.data)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false)); }, []); const authenticate = async (path: string, body: object) => { const { data } = await api.post<{ token: string; user: User }>(path, body); localStorage.setItem("token", data.token); setUser(data.user); return data.user; }; return <AuthContext.Provider value={{ user, isLoading, login: (email, password) => authenticate("/auth/login", { email, password }), register: (name, email, password) => authenticate("/auth/register", { name, email, password }), logout: () => { localStorage.removeItem("token"); setUser(null); } }}>{children}</AuthContext.Provider>; }
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value; }
