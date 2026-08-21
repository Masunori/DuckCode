import { extractAuthTokens } from "@/services/authCookies";
import { SubmitCodeResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<SubmitCodeResponse>> {
    try {
        const cookieHeader = extractAuthTokens(request.headers.get('cookie'));

        if (!cookieHeader) {
            return NextResponse.json(
                {
                    status: 401,
                    correct: 0,
                    exp: 0,
                    total: 0,
                    statusId: 0,
                    message: 'Not authenticated',
                },
                { status: 401 }
            );
        }

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
                { 
                    
                    correct: 0,
                    exp: 0,
                    total: 0,
                    statusId: 0,
                    status: response.status,
                    message: err.message || 'Failed to submit code' 
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // printd("@api/execute/submit-code/route.ts", "Submit code response:", data);

        return NextResponse.json(
            { ...data, message: 'Code submitted successfully' },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        return NextResponse.json(
            { 
                status: 500,
                message: `Internal server error: ${err}`,
                correct: 0,
                exp: 0,
                total: 0,
                statusId: 0
            },
            { status: 500 }
        );
    }
}
