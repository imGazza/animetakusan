import TokenManager from "@/lib/token-manager";
import axios, { type InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

let serverError = false;

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/auth/token`,
            { withCredentials: true }
        );
        TokenManager.setToken(response.data.accessToken, new Date(response.data.expiresAt));
        return TokenManager.getAccessToken();
    } catch (error) {
        TokenManager.clearToken();
        localStorage.setItem('isAuthenticated', 'false');
        //window.location.href = '/login';
        serverError = true;
        throw error;
    }
};

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

        if (serverError) {
            throw new Error("Server error detected, aborting requests.");
            // TODO: Find a better solution
        }

        // Skip token logic for the refresh endpoint itself
        if (config.url?.includes('/auth/token')) {
            return config;
        }

        // If no token exists or it's expired, get it before making the request
        if (!TokenManager.getAccessToken() || TokenManager.isTokenExpired()) {
            if (isRefreshing) {
                // Wait for ongoing refresh
                await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            } 
            else {
                isRefreshing = true;
                try {
                    await refreshToken();
                    processQueue(null, TokenManager.getAccessToken());
                } catch (error) {
                    processQueue(error, null);
                    throw error;
                } finally {
                    isRefreshing = false;
                }
            }
        }

        if (TokenManager.getAccessToken()) {
            config.headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Check for Unauthorized error 
        // Should never enter here because token refresh is handled in request interceptor
        // Kept for safety as a retry mechanism
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return client(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await refreshToken();
                processQueue(null, TokenManager.getAccessToken());   
                
                originalRequest.headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
                return client(originalRequest);
            } 
            catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } 
            finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export const httpClient = {
    get: async <T>(url: string): Promise<T> => {
        return (await client.get<T>(url)).data;
    },
    post: async <T>(url: string, params?: any): Promise<T> => {
        return (await client.post<T>(url, params)).data;
    },
    put: async <T>(url: string, params?: any): Promise<T> => {
        return (await client.put<T>(url, params)).data;
    },
    patch: async <T>(url: string, params?: any): Promise<T> => {
        return (await client.patch<T>(url, params)).data;
    },
    delete: async <T>(url: string): Promise<T> => {
        return (await client.delete<T>(url)).data;
    }
}
