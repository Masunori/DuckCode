import { extractAuthTokens } from "@/services/authCookies";
import type { GetQuestionByIdResponse } from "@/services/types";
import type { Example, Question } from "@/utils/gameplay";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<GetQuestionByIdResponse>> {
    try {
        const tokens = extractAuthTokens(request.headers.get('cookie'));

        if (!tokens) {
            return NextResponse.json(
                { status: 401, data: null, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const qid = searchParams.get('qid');

        printd("@app/api/question/get_question_by_id/route.ts", `Fetching question with QID: ${qid}`);

        const url = `${process.env.NEXT_PUBLIC_API_URL}question/get_question?question_id=${qid}`;

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
                    data: null,
                    message: err.message || err.error || 'Failed to fetch question',
                },
                { status: response.status }
            );
        }

        const res = await response.json();
        const question: Question = {
            ...res,
            examples: (res.examples ?? []).map((example: Example | { input: string; output: string; explanation: string }) => ({
                ...example,
                input: Array.isArray(example.input) ? example.input : example.input.split('\n'),
                output: Array.isArray(example.output) ? example.output : example.output.split('\n'),
            })),
        };

        printd("@app/api/question/get_question_by_id/route.ts", "Received response:", question);

        return NextResponse.json(
            { status: response.status, data: question, message: "Question fetched successfully" },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (error) {
        return NextResponse.json(
            { status: 500, data: null, message: "Internal server error" },
            { status: 500 }
        );
    }
}
