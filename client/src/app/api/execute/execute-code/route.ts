import { extractAuthTokens } from "@/services/authCookies";
import { RunCodeResponse } from "@/services/types";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<RunCodeResponse>> {
    try {
        const cookieHeader = extractAuthTokens(request.headers.get('cookie'));

        if (!cookieHeader) {
            return NextResponse.json(
                {
                    status: 401,
                    codeStatus: 'error',
                    output: [{ type: 'error', content: 'Not authenticated' }],
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "execute/execute-code", {
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
                    codeStatus: 'error',
                    output: [{ type: 'error', content: err.message || 'An error occurred while executing the code.' }],
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        printd("@apiClient/execution.ts", "Execute code response:", data);

        return NextResponse.json(
            {
                status: response.status,
                codeStatus: data.status,
                output: (data.output as string).split('\n').map((line) => ({
                    type: data.status === 'success' ? 'log' : 'error', content: line 
                })),
            },
            
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        return NextResponse.json(
            { 
                status: 500,
                codeStatus: 'error',
                output: [{ type: 'error', content: `Internal server error: ${err}`  }],
            }, 
            { status: 500 }
        );
    }
}
