import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LoginData, UserRole } from "@/types/auth";
import { isMockEnabled } from "@/mocks";
import { getMockUser } from "@/mocks/data/user";

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMockMode: boolean;
  login: (data: LoginData & { username?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getInitialState = () => {
  const isMockMode = isMockEnabled();

  if (isMockMode) {
    const mockUser = getMockUser();
    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("role", mockUser.role);
    localStorage.setItem("username", mockUser.username);
    return {
      token: mockUser.token,
      role: mockUser.role as UserRole,
      username: mockUser.username,
    };
  }

  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role") as UserRole | null,
    username: localStorage.getItem("username"),
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialState = getInitialState();
  const [token, setToken] = useState<string | null>(initialState.token);
  const [role, setRole] = useState<UserRole | null>(initialState.role);
  const [username, setUsername] = useState<string | null>(initialState.username);
  const [isLoading, setIsLoading] = useState(false);
  const isMockMode = isMockEnabled();

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
    <AuthContext.Provider value={{ token, role, username, isAuthenticated, isLoading, isMockMode, login, logout }}>
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
