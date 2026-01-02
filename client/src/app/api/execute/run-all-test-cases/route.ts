import { printd } from "@/app/utils/debugUtils";
import { p } from "motion/react-client";
import { NextResponse } from "next/server";
import test from "node:test";

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
                { ok: false, message: err.message || 'Failed to execute code' },
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