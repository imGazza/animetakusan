class TokenManager {
    private static Token: {
        accessToken: string | null;
        expiresAt: Date | null;
    } = {
        accessToken: null,
        expiresAt: null
    };

    public static getAccessToken(): string | null {
        return this.Token.accessToken;
    }

    public static isTokenExpired(): boolean {        
        if (!this.Token.expiresAt) return true;
        return new Date() >= new Date(this.Token.expiresAt);
    }

    public static setToken(accessToken: string | null, expiresAt: Date | null): void {
        this.Token.accessToken = accessToken;
        this.Token.expiresAt = expiresAt;
    }

    public static clearToken(): void {
        this.Token.accessToken = null;
        this.Token.expiresAt = null;
    }
}
export default TokenManager;