import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* <Button onClick={logout}>Sair</Button> */}
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
