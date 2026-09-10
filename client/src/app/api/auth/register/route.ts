import { SignUpResponse } from "@/services/types";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse<SignUpResponse>> {
    try {
        const body = await req.json();

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));
        return NextResponse.json({
            status: response.status,
            message: data.message || data.error || (response.ok ? "Registration successful" : "Registration failed"),
        }, {
            status: response.status,
        });
    } catch (err) {
        printd("@/api/auth/register", err)

        return NextResponse.json(
            { status: 500, message: [`Internal server error: ${err}`] },
            { status: 500 }
        )
    }
}
