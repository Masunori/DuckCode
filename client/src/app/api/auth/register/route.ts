import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(
            data, {
                status: response.status, 
                headers: response.headers
            }
        );
    } catch (err) {
        console.log(err)

        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` },
            { status: 500 }
        )
    }
}