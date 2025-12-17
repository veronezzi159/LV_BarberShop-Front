import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
      <p className="text-lg mb-6">
        Você não tem permissão para acessar esta página.
      </p>

      <Link
        to="/login"
        className="mt-4 bg-primary text-black px-6 py-3 rounded-md hover:bg-primary/80 transition"
      >
        Voltar
      </Link>
    </div>
  );
}
