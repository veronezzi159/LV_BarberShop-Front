import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function ProtectedLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Button onClick={logout}>Sair</Button>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
