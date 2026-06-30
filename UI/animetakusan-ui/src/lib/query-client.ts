import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

// Extracts the HTTP status from the Axios error
const statusOf = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined;

//Errors that are not simply notified with a toast, but hit the error boundary
export const shouldEscalate = (error: unknown): boolean => {
  const status = statusOf(error);
  return status === 404 || (status !== undefined && status >= 500);
};

// Retry only network errors and server errors (>= 500). Don't retry client errors (400-499).
const smartRetry = (failureCount: number, error: unknown): boolean => {
  const status = statusOf(error);
  if (status !== undefined && status >= 400 && status < 500) return false;
  return failureCount < 2;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (shouldEscalate(error)) return;
      if (query.meta?.silent) return;
      toast.error("Couldn't load data. Please try again.");
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Mutations don't escalate, they are notified with toasts.
      if (mutation.meta?.silent) return;
      const status = statusOf(error);
      toast.error(
        status === 401
          ? "Please sign in to continue."
          : "An error occurred. Please try again.",
      );
    },
  }),
  defaultOptions: {
    queries: {
      retry: smartRetry,
      throwOnError: (error) => shouldEscalate(error),
      staleTime: 60_000,
    },
    mutations: {
      retry: false,
      throwOnError: false,
    },
  },
});
