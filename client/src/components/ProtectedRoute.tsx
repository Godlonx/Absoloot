import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "ADMIN";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "ADMIN" && role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-red-600">Acces refuse</p>
      </div>
    );
  }

  return <>{children}</>;
};
