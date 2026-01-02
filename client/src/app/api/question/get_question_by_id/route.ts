import { printd } from "@/app/utils/debugUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const tokens = request.headers.get('cookie');

        const { searchParams } = new URL(request.url);

        const qid = searchParams.get('qid');

        printd("@app/api/question/get_question_by_id/route.ts", `Fetching question with QID: ${qid}`);

        const url = `${process.env.NEXT_PUBLIC_API_URL}question/get_question?question_id=${qid}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": tokens || "",
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to fetch question' },
                { status: response.status }
            );
        }

        const res = await response.json();
        return NextResponse.json(
            { ok: true, data: res },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (error) {
        return NextResponse.json(
            { ok: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}