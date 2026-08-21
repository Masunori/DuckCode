export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}

export function getCookieValue(cookieHeader: string | null, cookieName: string): string | null {
    if (!cookieHeader) {
        return null;
    }

    for (const cookie of cookieHeader.split(';')) {
        const separatorIndex = cookie.indexOf('=');

        if (separatorIndex === -1) {
            continue;
        }

        const name = cookie.slice(0, separatorIndex).trim();

        if (name === cookieName) {
            return cookie.slice(separatorIndex + 1).trim();
        }
    }

    return null;
}

export function extractAuthTokens(cookieHeader: string | null): AuthTokens | null {
    const accessToken = getCookieValue(cookieHeader, 'accessToken');
    const refreshToken = getCookieValue(cookieHeader, 'refreshToken');

    if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
    }

    return null;
}
