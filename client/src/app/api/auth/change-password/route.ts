import { extractAuthTokens } from "@/services/authCookies";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const tokens = extractAuthTokens(request.headers.get('Cookie'));

        if (!tokens) {
            return NextResponse.json(
                { status: 401, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const payload = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/change-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': JSON.stringify(tokens),
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const res = await response.json();
            const err = res.message || res.error || 'Change password failed';

            printd("@app/api/auth/change-password/route.ts", "Change password failed:", err);

            return NextResponse.json(
                { status: response.status, message: err },
                { status: response.status }
            );
        }

        const passwordChangeData = await response.json();

        printd("@app/api/auth/change-password/route.ts", "Change password successful, response data:", passwordChangeData);

        const newAccessToken = passwordChangeData.token.accessToken;
        const newRefreshToken = passwordChangeData.token.refreshToken;

        printd("@app/api/auth/change-password/route.ts", "Password changed successfully, new tokens received.");
        printd("@app/api/auth/change-password/route.ts", "New Access Token:", newAccessToken);
        printd("@app/api/auth/change-password/route.ts", "New Refresh Token:", newRefreshToken);

        const res = NextResponse.json(
            { status: 200, message: "Password changed successfully" },
            { status: 200 }
        );

        res.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
            // maxAge: 60, // 1 minute
        });

        res.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 1 week
        });

        return res;

    } catch (err) {
        return NextResponse.json(
            { status: 500, message: `Internal server error: ${err}` },
            { status: 500 }
        )
    }
}
