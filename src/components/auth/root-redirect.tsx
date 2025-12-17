// src/components/auth/root-redirect.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getHomeRouteByRole } from "@/utils/roles";

export function RootRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const destination = getHomeRouteByRole(user.roles);

  return <Navigate to={destination} replace />;
}
