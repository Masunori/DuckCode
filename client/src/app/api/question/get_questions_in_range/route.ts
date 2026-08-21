import { extractAuthTokens } from "@/services/authCookies";
import type { GetQuestionsInRangeResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<GetQuestionsInRangeResponse>> {
    try {
        const tokens = extractAuthTokens(request.headers.get('cookie'));
        
        if (!tokens) {
            return NextResponse.json(
                { status: 401, data: [], message: "Not authenticated" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const minDifficulty = searchParams.get('min_difficulty');
        const maxDifficulty = searchParams.get('max_difficulty');

        const url = `${process.env.NEXT_PUBLIC_API_URL}question/get_questions_in_range?minDifficulty=${minDifficulty}&maxDifficulty=${maxDifficulty}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": JSON.stringify(tokens),
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    status: response.status,
                    data: [],
                    message: err.message || err.error || 'Failed to fetch questions',
                },
                { status: response.status }
            );
        }

        const res = await response.json();
        // printd("@/app/api/question/get_questions_in_range/route.ts", `Fetched questions in range ${minDifficulty}-${maxDifficulty}:`, res);
        
        return NextResponse.json(
            {
                status: response.status,
                data: Array.isArray(res) ? res : [],
                message: "Questions fetched successfully",
            },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        return NextResponse.json(
            { status: 500, data: [], message: `Internal server error: ${err}` },
            { status: 500 }
        );
    }
}
