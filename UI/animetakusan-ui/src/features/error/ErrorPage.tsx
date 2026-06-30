import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  variant?: "fullpage" | "scoped";
};

const statusOf = (error: unknown): number | undefined => {
  if (isRouteErrorResponse(error)) return error.status; // Router error
  if (isAxiosError(error)) return error.response?.status; // API error
  return undefined;
};

const ErrorPage = ({ variant = "fullpage" }: ErrorPageProps) => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { reset } = useQueryErrorResetBoundary();

  const status = statusOf(error);
  const is404 = status === 404;
  const is5xx = status !== undefined && status >= 500;

  const title = is404
    ? "Page not found"
    : is5xx
      ? "Something went wrong on our side"
      : "Something went wrong";

  const message = is404
    ? "The page or anime you're looking for doesn't exist."
    : is5xx
      ? "The server had a problem. Please try again in a moment."
      : "An unexpected error occurred.";

  const handleRetry = () => {
    // Clear the thrown query error so it refetches instead of re-throwing,
    // then re-run the current route.
    reset();
    navigate(0);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center px-6 ${
        variant === "scoped" ? "min-h-[50vh]" : "min-h-screen"
      }`}
    >
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden
        className="h-24 w-24 object-contain"
      />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <div className="flex gap-3">
        {is404 ? (
          <Button onClick={() => navigate("/browse")}>Go to Browse</Button>
        ) : (
          <>
            <Button onClick={handleRetry}>Try again</Button>
            <Button variant="outline" onClick={() => navigate("/browse")}>
              Go to Browse
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
