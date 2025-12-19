import type { LoginRequest } from "@/models/auth/LoginRequest"
import type { User } from "@/models/auth/User"
import { createContext } from "react"

export const AuthContext = createContext<{
    isAuthenticated: boolean,
    user: User | null,
    login: (loginRequest: LoginRequest) => void,
    logout: () => void
}>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {}
})