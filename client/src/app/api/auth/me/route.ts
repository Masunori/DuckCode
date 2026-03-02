import { printd } from "@/lib/utils/debugUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const tokens = request.headers.get('Cookie');
        
        if (!tokens) {
            return NextResponse.json(
                { ok: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': tokens,
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to fetch user' },
                { status: response.status },
            );
        }

        const res = await response.json();
        const user = res.data;

        return NextResponse.json(
            { ok: true, user: user },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        printd("@/app/api/auth/me/route", "Error in GET /auth/me:", err);

        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` }, 
            { status: 500 }
        );
    }
}