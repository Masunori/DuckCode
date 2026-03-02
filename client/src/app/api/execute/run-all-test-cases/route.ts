import { printd } from "@/lib/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const tokens = request.headers.get('cookie');
        const accessToken =
            tokens
                ?.split('; ')
                .find(c => c.startsWith('accessToken='))
                ?.split('=')[1] ?? null;

        const refreshToken =
            tokens
                ?.split('; ')
                .find(c => c.startsWith('refreshToken='))
                ?.split('=')[1] ?? null;
                
        const cookieHeader = {
            'accessToken': accessToken,
            'refreshToken': refreshToken
        };

        const body = await request.json();

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "execute/run-all-test-cases", {
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
                { ok: false, message: err.message || 'Failed to run test cases' },
                { status: response.status }
            );
        }

        const data = await response.json();

        type TestCase = {
            status: {
                id: number;
                description: string;
            };
            stdout: string;
            testcaseId: number;
            compile_output?: string;
            stderr?: string;
        }

        const testCaseResults = data.map((testCase: TestCase) => (
            {
                tid: testCase.testcaseId,
                actualOutput: testCase.stdout,
                statusId: testCase.status.id,
                message: testCase.compile_output ?? testCase.stderr ?? testCase.status.description,
            }
        ));

        return NextResponse.json(
            { ok: true, data: testCaseResults },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        printd("@api/execute/run-all-test-cases/route.ts", "Error in POST:", err);

        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` },
            { status: 500 }
        );
    }
}