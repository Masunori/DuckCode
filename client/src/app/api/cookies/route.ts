import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    return NextResponse.json(
        { accessToken, refreshToken },
        { status: 200 }
    );
}