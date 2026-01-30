import { Outlet } from "react-router";
import AuthProvider from "@/providers/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme/ThemeProviders";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default RootLayout;