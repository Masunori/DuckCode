import { LogoutResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<LogoutResponse>> {
    const res = NextResponse.json({ status: 200, message: "Successfully logged out" }, { status: 200 });

    res.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax', // or 'None' if cross-site redirect needed
        path: '/',
        maxAge: 0,
    });

    res.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax', // or 'None' if cross-site redirect needed
        path: '/',
        maxAge: 0,
    });

    const tokens = request.headers.get('Cookie');
        
    if (!tokens) {
        return NextResponse.json(
            { status: 401, message: "Not authenticated" },
            { status: 401 }
        );
    }

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Cookie': tokens,
        }
    });

    return res;
}