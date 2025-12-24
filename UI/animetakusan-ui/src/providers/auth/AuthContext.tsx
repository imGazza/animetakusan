import type { LoginRequest } from "@/models/auth/LoginRequest"
import type { User } from "@/models/auth/User"
import { createContext } from "react"

export const AuthContext = createContext<{
    isAuthenticated: boolean,
    user: User | null,
    login: (loginRequest: LoginRequest) => void,
    loginProvider: (provider: string) => void,
    logout: () => void,
    signUp: (registerRequest: any, callbackFn?: () => void) => void,
}>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    loginProvider: () => {},
    logout: () => {},
    signUp: () => {},
})