import { ResetPasswordResponse } from "@/services/types";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse<ResetPasswordResponse>> {
    try {
        const body = await req.json();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));

        return NextResponse.json({
            status: response.status,
            message: data.message || data.error || (response.ok ? "Password reset successfully" : "Password reset failed"),
        }, {
            status: response.status,
            headers: response.headers
        });
    } catch (err) {
        console.log(err);

        return NextResponse.json(
            { status: 500, message: `Internal server error: ${err}` }, 
            { status: 500 }
        );
    }
}
