import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { RequireAuth } from "./components/auth/require-auth";
import { RequireRole } from "./components/auth/require-role";
import { ProtectedLayout } from "./layouts/protected-layout";
import { DashboardPage } from "./pages/app/dashboard";
import { UnauthorizedPage } from "./pages/unauthorized-page";
import { ClientPage } from "./pages/client";

export const route = createBrowserRouter([
  // Rotas públicas
  {
    path: "/",
    element: <Navigate to={"/login"} replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
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
              <RequireRole allowedRoles={["client", "manager", "barbers"]} />
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
                path: "/dashboard",
                element: <DashboardPage />,
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
