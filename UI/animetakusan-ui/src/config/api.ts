/**
 * API Configuration
 * Centralized API endpoint configuration
 */

// Base API URL - can be overridden with environment variables
export const API_BASE_URL = 'https://localhost:5016';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/Auth/google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/Auth/google-callback`,
  },
  PUBLIC: {
    MESSAGE: `${API_BASE_URL}/api/Public/message`,
  },
  WEATHER: `${API_BASE_URL}/WeatherForecast`,
} as const;
