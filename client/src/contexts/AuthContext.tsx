import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LoginData, UserRole } from "@/types/auth";
import { isMockEnabled } from "@/mocks";
import { getMockUser } from "@/mocks/data/user";

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  username: string | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
  login: (data: LoginData & { username?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const isMockMode = isMockEnabled();

  useEffect(() => {
    if (isMockMode) {
      const mockUser = getMockUser();
      setToken(mockUser.token);
      setRole(mockUser.role);
      setUsername(mockUser.username);
      localStorage.setItem("token", mockUser.token);
      localStorage.setItem("role", mockUser.role);
      localStorage.setItem("username", mockUser.username);
      return;
    }

    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as UserRole | null;
    const storedUsername = localStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [isMockMode]);

  const login = (data: LoginData & { username?: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    if (data.username) {
      localStorage.setItem("username", data.username);
      setUsername(data.username);
    }
    setToken(data.token);
    setRole(data.role);
  };

  const logout = () => {
    if (isMockMode) {
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider value={{ token, role, username, isAuthenticated, isMockMode, login, logout }}>
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
