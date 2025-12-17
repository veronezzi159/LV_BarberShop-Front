import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { RequireAuth } from "./components/auth/require-auth";
import { RequireRole } from "./components/auth/require-role";
import { ProtectedLayout } from "./layouts/protected-layout";
import { UnauthorizedPage } from "./pages/unauthorized-page";
import ClientPage from "./pages/client";
import { useAuth } from "./contexts/AuthContext";
import { getHomeRouteByRole } from "./utils/roles";
import ManagerPageLayout from "./pages/manager";
import BarberPageLayout from "./pages/barber";
import { Dashboard } from "./pages/manager/dashboard";
import { Products } from "./pages/manager/products";
import { Stocks } from "./pages/manager/stocks";
import { NewBarber } from "./pages/manager/new-barber";
import { Reports } from "./pages/manager/reports";
import { MyAgenda } from "./pages/barber/my-agenda";
import { Appointment } from "./pages/barber/appointment";

// eslint-disable-next-line react-refresh/only-export-components
const LoginWrapper = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to={getHomeRouteByRole(user.roles)} replace />;
  }

  return <LoginPage />;
};

export const route = createBrowserRouter([
  // Rotas públicas
  {
    path: "/",
    element: <Navigate to={"/login"} replace />,
  },
  {
    path: "/login",
    element: <LoginWrapper />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: (
              <RequireRole allowedRoles={["client", "manager", "barber"]} />
            ),
            children: [
              {
                path: "/cliente",
                element: <ClientPage />,
              },
            ],
          },
          {
            element: <RequireRole allowedRoles={["manager"]} />,
            children: [
              {
                path: "/gerente",
                element: <ManagerPageLayout />,
                children: [
                  {
                    path: "",
                    element: <Navigate to={"/gerente/dashboard"} replace />,
                  },
                  {
                    path: "dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "produtos",
                    element: <Products />,
                  },
                  {
                    path: "estoques",
                    element: <Stocks />,
                  },
                  {
                    path: "relatorios",
                    element: <Reports />,
                  },
                  {
                    path: "cadastrar-barbeiro",
                    element: <NewBarber />,
                  },
                ],
              },
            ],
          },
          {
            element: <RequireRole allowedRoles={["barber", "manager"]} />,
            children: [
              {
                path: "/barbeiro",
                element: <BarberPageLayout />,
                children: [
                  {
                    path: "",
                    element: <Navigate to={"/barbeiro/minha-agenda"} replace />,
                  },
                  {
                    path: "minha-agenda",
                    element: <MyAgenda />,
                  },
                  {
                    path: "agendar",
                    element: <Appointment />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // Rotas contem manager/barbeiro

  //Rotas que nao tem nada
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
]);
