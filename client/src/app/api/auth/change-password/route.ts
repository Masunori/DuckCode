import { printd } from "@/lib/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const tokens = request.headers.get('Cookie');
        const accessToken = tokens?.split(';').find(token => token.trim().startsWith('accessToken='))?.split('=')[1];
        const refreshToken = tokens?.split(';').find(token => token.trim().startsWith('refreshToken='))?.split('=')[1];

        if (!accessToken || !refreshToken) {
            return NextResponse.json(
                { ok: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const payload = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/change-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': JSON.stringify({ accessToken, refreshToken }),
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const res = await response.json();
            const err = res.error || 'Change password failed';

            printd("@app/api/auth/change-password/route.ts", "Change password failed:", err);

            return NextResponse.json(
                { ok: false, message: err },
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
            { ok: true }
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
            { ok: false, message: `Internal server error: ${err}` },
            { status: 500 }
        )
    }
}