// import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';

// // Environment config
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const REQUEST_TIMEOUT = 30000; // 30 seconds
// const MAX_RETRIES = 3;
// const RETRY_DELAY = 1000; // 1 second

// // Types
// export interface ApiError {
//   message: string;
//   status?: number;
//   code?: string;
//   errors?: Record<string, string[]>;
// }

// export interface RequestConfig extends AxiosRequestConfig {
//   _retry?: number;
//   skipAuth?: boolean;
//   skipErrorHandler?: boolean;
// }

// // Token management
// class TokenManager {
//   private static readonly TOKEN_KEY = 'access_token';
//   private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

//   static getAccessToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   static setAccessToken(token: string): void {
//     localStorage.setItem(this.TOKEN_KEY, token);
//   }

//   static getRefreshToken(): string | null {
//     return localStorage.getItem(this.REFRESH_TOKEN_KEY);
//   }

//   static setRefreshToken(token: string): void {
//     localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
//   }

//   static clearTokens(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.REFRESH_TOKEN_KEY);
//   }

//   static hasValidToken(): boolean {
//     return !!this.getAccessToken();
//   }
// }

// // Request deduplication
// class RequestDeduplicator {
//   private pendingRequests = new Map<string, Promise<AxiosResponse>>();

//   private getRequestKey(config: AxiosRequestConfig): string {
//     const { method = 'get', url = '', params, data } = config;
//     return `${method.toUpperCase()}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
//   }

//   deduplicate<T = any>(
//     config: AxiosRequestConfig,
//     request: () => Promise<AxiosResponse<T>>
//   ): Promise<AxiosResponse<T>> {
//     const key = this.getRequestKey(config);
    
//     if (this.pendingRequests.has(key)) {
//       return this.pendingRequests.get(key) as Promise<AxiosResponse<T>>;
//     }

//     const promise = request().finally(() => {
//       this.pendingRequests.delete(key);
//     });

//     this.pendingRequests.set(key, promise);
//     return promise;
//   }

//   clear(): void {
//     this.pendingRequests.clear();
//   }
// }

// const deduplicator = new RequestDeduplicator();

// // Axios instance
// const client: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: REQUEST_TIMEOUT,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   // Enable response compression
//   decompress: true,
// });

// // Request interceptor
// client.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const customConfig = config as RequestConfig;
    
//     // Add auth token if available and not skipped
//     if (!customConfig.skipAuth) {
//       const token = TokenManager.getAccessToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     // Add request timestamp for performance tracking
//     config.headers['X-Request-Time'] = Date.now().toString();

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// client.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // Log performance metrics in development
//     if (import.meta.env.DEV) {
//       const requestTime = response.config.headers['X-Request-Time'];
//       if (requestTime) {
//         const duration = Date.now() - Number(requestTime);
//         console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
//       }
//     }

//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as RequestConfig;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     // Handle 401 Unauthorized - attempt token refresh
//     if (error.response?.status === 401 && !originalRequest.skipAuth) {
//       const refreshToken = TokenManager.getRefreshToken();
      
//       if (refreshToken && !originalRequest.url?.includes('/refresh')) {
//         try {
//           const response = await axios.post(
//             `${API_BASE_URL}/auth/refresh`,
//             { refreshToken },
//             { skipAuth: true } as RequestConfig
//           );

//           const { accessToken } = response.data;
//           TokenManager.setAccessToken(accessToken);

//           // Retry original request with new token
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return client(originalRequest);
//         } catch (refreshError) {
//           // Refresh failed, clear tokens and redirect to login
//           TokenManager.clearTokens();
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       } else {
//         // No refresh token or refresh endpoint failed
//         TokenManager.clearTokens();
//         window.location.href = '/login';
//       }
//     }

//     // Retry logic for network errors and 5xx errors
//     if (shouldRetry(error) && originalRequest) {
//       const retryCount = originalRequest._retry || 0;

//       if (retryCount < MAX_RETRIES) {
//         originalRequest._retry = retryCount + 1;

//         // Exponential backoff
//         const delay = RETRY_DELAY * Math.pow(2, retryCount);
//         await sleep(delay);

//         console.log(`[API] Retrying request (${retryCount + 1}/${MAX_RETRIES}):`, originalRequest.url);
//         return client(originalRequest);
//       }
//     }

//     // Handle error and skip custom error handler if requested
//     if (!originalRequest.skipErrorHandler) {
//       handleApiError(error);
//     }

//     return Promise.reject(error);
//   }
// );

// // Helper functions
// function shouldRetry(error: AxiosError): boolean {
//   // Retry on network errors
//   if (!error.response) {
//     return true;
//   }

//   // Retry on 5xx server errors (except 501 Not Implemented)
//   const status = error.response.status;
//   if (status >= 500 && status !== 501) {
//     return true;
//   }

//   // Retry on specific status codes
//   const retryableStatuses = [408, 429]; // Request Timeout, Too Many Requests
//   return retryableStatuses.includes(status);
// }

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function handleApiError(error: AxiosError): void {
//   if (error.response) {
//     // Server responded with error
//     const status = error.response.status;
//     const data = error.response.data as any;

//     console.error(`[API Error ${status}]:`, data?.message || error.message);

//     // You can add toast notifications or other error handling here
//     // Example: toast.error(data?.message || 'An error occurred');
//   } else if (error.request) {
//     // Request made but no response
//     console.error('[API Error]: No response from server', error.message);
//     // Example: toast.error('Unable to connect to server');
//   } else {
//     // Error setting up request
//     console.error('[API Error]:', error.message);
//   }
// }

// // API client methods
// export const apiClient = {
//   /**
//    * GET request
//    */
//   get: <T = any>(url: string, config?: RequestConfig): Promise<T> => {
//     return deduplicator.deduplicate(
//       { method: 'get', url, ...config },
//       () => client.get<T>(url, config)
//     ).then((response) => response.data);
//   },

//   /**
//    * POST request
//    */
//   post: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
//     return client.post<T>(url, data, config).then((response) => response.data);
//   },

//   /**
//    * PUT request
//    */
//   put: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
//     return client.put<T>(url, data, config).then((response) => response.data);
//   },

//   /**
//    * PATCH request
//    */
//   patch: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
//     return client.patch<T>(url, data, config).then((response) => response.data);
//   },

//   /**
//    * DELETE request
//    */
//   delete: <T = any>(url: string, config?: RequestConfig): Promise<T> => {
//     return client.delete<T>(url, config).then((response) => response.data);
//   },

//   /**
//    * Upload file with progress
//    */
//   upload: <T = any>(
//     url: string,
//     formData: FormData,
//     onUploadProgress?: (progressEvent: any) => void,
//     config?: RequestConfig
//   ): Promise<T> => {
//     return client
//       .post<T>(url, formData, {
//         ...config,
//         headers: {
//           ...config?.headers,
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress,
//       })
//       .then((response) => response.data);
//   },

//   /**
//    * Download file
//    */
//   download: (url: string, filename: string, config?: RequestConfig): Promise<void> => {
//     return client
//       .get(url, {
//         ...config,
//         responseType: 'blob',
//       })
//       .then((response) => {
//         const blob = new Blob([response.data]);
//         const link = document.createElement('a');
//         link.href = window.URL.createObjectURL(blob);
//         link.download = filename;
//         link.click();
//         window.URL.revokeObjectURL(link.href);
//       });
//   },

//   /**
//    * Create an AbortController for request cancellation
//    */
//   createAbortController: (): AbortController => {
//     return new AbortController();
//   },

//   /**
//    * Clear request deduplication cache
//    */
//   clearCache: (): void => {
//     deduplicator.clear();
//   },
// };

// // Export token manager for auth operations
// export { TokenManager };

// // Export axios instance for advanced usage
// export default client;
