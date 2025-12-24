import { httpClient } from "@/http/client";
import type { LoginRequest } from "@/models/auth/LoginRequest";
import type { RegisterRequest } from "@/models/auth/RegisterRequest";
import type { TokenResponse } from "@/models/auth/TokenResponse";
import type { User } from "@/models/auth/User";

export const authApis = {
    token: () => httpClient.get<TokenResponse>('/auth/token'),
    userInfo: () => httpClient.get<User>('/auth/user'),
    login: (loginRequest: LoginRequest) => httpClient.post<TokenResponse>('/auth/login', loginRequest),
    logout: () => httpClient.post('/auth/logout'),
    googleLogin: () => httpClient.get<TokenResponse>('/auth/google'),
    signUp: (registerRequest: RegisterRequest) => httpClient.post<TokenResponse>('/auth/signup', registerRequest),
}