import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LoginData, UserRole } from "@/types/auth";

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as UserRole | null;

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const login = (data: LoginData) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    setToken(data.token);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
