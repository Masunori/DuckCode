import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });

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

    return res;
}