import "./globals.css";
import { route } from "./route";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={route} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
