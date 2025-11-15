import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "./globals.css";
import { route } from "./route";
import { RouterProvider } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route} />
      </QueryClientProvider>
    </>
  );
}

export default App;
