// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${import.meta.env.VITE_API_BASE_URL}/api/Auth/google`,
    GOOGLE_CALLBACK: `${import.meta.env.VITE_API_BASE_URL}/api/Auth/google-callback`,
  }
} as const;
