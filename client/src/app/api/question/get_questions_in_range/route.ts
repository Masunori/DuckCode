import { printd } from "@/lib/utils/debugUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const tokens = request.headers.get('cookie');
        const accessToken = tokens?.split('; ').filter(cookie => cookie.startsWith('accessToken='))[0]?.split('=')[1];
        const refreshToken = tokens?.split('; ').filter(cookie => cookie.startsWith('refreshToken='))[0]?.split('=')[1];
        
        if (!accessToken || !refreshToken) {
            return NextResponse.json(
                { ok: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const cookieHeader = {
            'accessToken': accessToken,
            'refreshToken': refreshToken
        };

        const { searchParams } = new URL(request.url);

        const minDifficulty = searchParams.get('min_difficulty');
        const maxDifficulty = searchParams.get('max_difficulty');

        const url = `${process.env.NEXT_PUBLIC_API_URL}question/get_questions_in_range?minDifficulty=${minDifficulty}&maxDifficulty=${maxDifficulty}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": JSON.stringify(cookieHeader),
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => {});
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to fetch questions' },
                { status: response.status }
            );
        }

        const res = await response.json();
        printd("@/app/api/question/get_questions_in_range/route.ts", `Fetched questions in range ${minDifficulty}-${maxDifficulty}:`, res);
        
        return NextResponse.json(
            { ok: true, res },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` },
            { status: 500 }
        );
    }
}