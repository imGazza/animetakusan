import { Outlet } from "react-router";
import AuthProvider from "@/providers/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme/ThemeProviders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>          
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default RootLayout;