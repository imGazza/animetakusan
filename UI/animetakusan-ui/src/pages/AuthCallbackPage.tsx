import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    // Check URL parameters for authentication status
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(`Authentication failed: ${error}`);
      return;
    }

    // Authentication successful
    setStatus("success");
    setMessage("Authentication successful! Redirecting...");

    // Store authentication state (you might want to use a proper state management solution)
    localStorage.setItem("isAuthenticated", "true");

    // Redirect to home page after 2 seconds
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "✓ Success"}
            {status === "error" && "✗ Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          {status === "loading" && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
