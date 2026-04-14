import { printd } from "@/lib/utils/debugUtils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "admin_question/add_question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, message: err.message || 'Failed to add question' },
                { status: response.status },
            );
        }

        const res = await response.json();
        const user = res.data;

        return NextResponse.json(
            { ok: true, user: user },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        console.log(err);

        return NextResponse.json(
            { ok: false, message: `Internal server error: ${err}` },
            { status: 500 }
        )
    }
}