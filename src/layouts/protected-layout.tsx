import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span>Olá, **{user.name}**</span>
          <small> (Roles: {user.roles.join(", ")})</small>
        </div>
        <button onClick={logout}>Sair</button>
      </header>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
