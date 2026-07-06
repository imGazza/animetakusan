import type { LoginRequest } from "@/models/auth/LoginRequest"
import type { User } from "@/models/auth/User"
import { createContext } from "react"

export const AuthContext = createContext<{
    isAuthenticated: boolean,
    isInitializing: boolean,
    user: User | null,
    login: (loginRequest: LoginRequest) => void,
    loginProvider: (provider: string) => void,
    logout: () => void,
    signUp: (registerRequest: { email: string, username: string, password: string, confirmPassword: string }, callbackFn?: () => void) => void,
}>({
    isAuthenticated: false,
    isInitializing: true,
    user: null,
    login: () => {},
    loginProvider: () => {},
    logout: () => {},
    signUp: () => {},
})