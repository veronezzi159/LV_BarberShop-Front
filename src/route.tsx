import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"} />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
