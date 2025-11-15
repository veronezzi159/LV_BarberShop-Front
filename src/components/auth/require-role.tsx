import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireRoleProps {
  allowedRoles: string[];
}

/**
 * Este componente assume que o usuário JÁ ESTÁ LOGADO (deve ser
 * usado dentro de um <RequireAuth>).
 *
 * Ele verifica se o usuário logado possui ALGUMA das roles permitidas.
 * Se não tiver, redireciona para a página /unauthorized.
 */
export function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user } = useAuth();

  // O <RequireAuth> que deve envolver essa rota já cuidou
  // do caso de 'user' ser nulo. Mas por segurança, checamos.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o array de roles do usuário inclui pelo menos
  // uma das roles permitidas.
  const hasRole = user.roles.some((role) => allowedRoles.includes(role));

  if (hasRole) {
    return <Outlet />; // Usuário tem a permissão, renderiza o conteúdo
  }

  // Usuário logado, mas sem permissão
  return <Navigate to="/unauthorized" replace />;
}