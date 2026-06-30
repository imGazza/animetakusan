import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Last-resort error boundary wrapping <RouterProvider>. It catches catastrophic
 * errors thrown OUTSIDE the route tree (router/provider setup) that the route
 * errorElement cannot reach. It must stay dumb: QueryClient, router hooks, theme
 * and toast all live inside the router, below this boundary, so none are usable
 * here. Anything inside the routes is handled by ErrorPage instead.
 */
class RootErrorFallback extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Fatal application error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ opacity: 0.7 }}>The application failed to load. Please reload the page.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid currentColor",
            cursor: "pointer",
            background: "transparent",
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}

export default RootErrorFallback;
