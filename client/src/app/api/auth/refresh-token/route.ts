import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const tokens = request.headers.get('cookie')?.split('; ').filter(cookie => cookie.startsWith('refreshToken='))[0].split('=')[1];

        if (!tokens) {
            console.log("No refresh token found in cookies");
            return NextResponse.json(
                { ok: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": JSON.stringify({ refreshToken: tokens }),
            },
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to refresh token' },
                { status: response.status }
            );
        }

        const refreshData = await response.json();
        const accessToken = refreshData.data.accessToken;
        const refreshToken = refreshData.data.refreshToken;

        const res = NextResponse.json(
            { ok: true, data: { accessToken, refreshToken } }
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
            { ok: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}