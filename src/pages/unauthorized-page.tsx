import { Link } from "react-router-dom";
export function UnauthorizedPage() {
  return (
    <div>
      <h1>403 - Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/home">Voltar para Home</Link>
    </div>
  );
}
