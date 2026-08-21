import { getCookieValue } from "@/services/authCookies";
import { RefreshTokenResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<RefreshTokenResponse>> {
    try {
        const refreshTokenCookie = getCookieValue(request.headers.get('cookie'), 'refreshToken');

        if (!refreshTokenCookie) {
            console.log("No refresh token found in cookies");
            return NextResponse.json(
                { status: 401, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": JSON.stringify({ refreshToken: refreshTokenCookie }),
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { status: response.status, message: err.message || err.error || 'Failed to refresh token' },
                { status: response.status }
            );
        }

        const refreshData = await response.json();
        const accessToken = refreshData.data.accessToken;
        const refreshToken = refreshData.data.refreshToken;

        const res = NextResponse.json(
            { status: 200, message: refreshData.message || "Token refreshed successfully" }
        );

        res.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
        });

        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 1 week
        });

        return res;
    } catch (error) {
        console.error("Error in refresh-token route:", error);
        return NextResponse.json(
            { status: 500, message: "Internal server error" },
            { status: 500 }
        );
    }
}
