import { printd } from "@/app/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const tokens = request.headers.get('cookie');
        const accessToken = tokens?.split('; ').filter(cookie => cookie.startsWith('accessToken='))[0].split('=')[1];
        const refreshToken = tokens?.split('; ').filter(cookie => cookie.startsWith('refreshToken='))[0].split('=')[1];

        const cookieHeader = {
            'accessToken': accessToken,
            'refreshToken': refreshToken
        };

        const body = await request.json();

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "execute/submit-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": JSON.stringify(cookieHeader),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to submit code' },
                { status: response.status }
            );
        }

        const data = await response.json();

        printd("@api/execute/submit-code/route.ts", "Submit code response:", data);

        return NextResponse.json(
            { ok: true, data: data },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` }, 
            { status: 500 }
        );
    }
}