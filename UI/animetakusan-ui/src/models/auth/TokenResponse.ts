import type { User } from "./User";

export interface TokenResponse {
    accessToken: string;
    user: User;
}