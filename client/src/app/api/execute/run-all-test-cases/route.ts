import { extractAuthTokens } from "@/services/authCookies";
import { RunAllTestCasesResponse } from "@/services/types";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<RunAllTestCasesResponse>> {
    try {
        const cookieHeader = extractAuthTokens(request.headers.get('cookie'));

        if (!cookieHeader) {
            return NextResponse.json(
                {
                    status: 401,
                    results: [],
                    message: 'Not authenticated',
                },
                { status: 401 }
            );
        }

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
                { 
                    status: response.status,
                    results: [],
                    message: err.message || 'Failed to run test cases' 
                },
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
            { 
                status: response.status,
                results: testCaseResults,
                message: 'Test cases run successfully.'
            },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        printd("@api/execute/run-all-test-cases/route.ts", "Error in POST:", err);

        return NextResponse.json(
            { 
                status: 500,
                results: [],
                message: `Internal server error: ${err}` 
            },
            { status: 500 }
        );
    }
}
