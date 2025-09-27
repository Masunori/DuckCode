import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/request-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        // const contentType = response.headers.get("content-type") || "";
        // const data = contentType.includes("application/json")
        //     ? await response.json()
        //     : await response.text();

        // console.log(data)

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
            headers: response.headers
        });
    } catch (err) {
        console.log(err);

        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` }, 
            { status: 500 }
        );
    }
}