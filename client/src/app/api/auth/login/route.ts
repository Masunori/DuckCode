import { LoginResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse<LoginResponse>> {
    try {
        const body = await req.json();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));

            return NextResponse.json(
                { 
                    status: response.status,
                    message: err.message || err.error || 'Login failed' 
                },
                { status: response.status }
            );
        }

        const loginData = await response.json();
        const accessToken = loginData.data.accessToken;
        const refreshToken = loginData.data.refreshToken;
        const res = NextResponse.json(
            { 
                status: response.status,
                message: loginData.message || 'Login successful' 
            },
            { status: response.status }
        );

        res.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
            // maxAge: 60, // 1 minute
        });

        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 1 week
        });

        return res;
    } catch (err) {
        console.log(err);

        return NextResponse.json(
            { 
                status: 500,
                message: `Internal server error: ${err}` 
            },
            { status: 500 }
        )
    }
}
