import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  // Auth ancora in fase di bootstrap (GET /auth/token -> GET /auth/user):
  // mostriamo un loader invece di decidere prematuramente -> niente flash.
  // La gif è precaricata in index.html, quindi è già in cache quando renderizza.
  if (isInitializing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center animate-in fade-in duration-200">
        <img
          src="/images/loader.gif"
          alt="Loading"
          className="h-30 w-30 object-contain"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
