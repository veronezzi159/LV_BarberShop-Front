import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Este componente verifica se o usuário está logado.
 * Se não estiver, redireciona para a página de login.
 * Se estiver, renderiza as rotas filhas (Outlet).
 */
export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Espera o AuthContext terminar sua verificação inicial
  // Isso previne o "flicker" de redirecionar para /login antes
  // de ter lido o localStorage.
  if (isLoading) {
    return <div>Carregando autenticação...</div>;
  }

  // 2. Se não estiver carregando e não houver usuário, redireciona
  if (!user) {
    // Salva a página que o usuário tentou acessar no 'state'
    // para podermos redirecioná-lo de volta após o login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
