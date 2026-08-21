import type { User } from "@/app/userPrefs/userPrefsTypes";
import { extractAuthTokens } from "@/services/authCookies";
import type { GetProfileResponse } from "@/services/types";
import { printd } from "@/utils/debugUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<GetProfileResponse>> {
    try {
        const tokens = extractAuthTokens(request.headers.get('Cookie'));
        
        if (!tokens) {
            return NextResponse.json(
                { status: 401, user: null, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': JSON.stringify(tokens),
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    status: response.status,
                    user: null,
                    message: err.message || err.error || 'Failed to fetch user',
                },
                { status: response.status },
            );
        }

        const res = await response.json();
        const userData = res.data as User;
        const level = Math.floor(
            Math.log10((userData.exp / 100) + 1) / Math.log10(1.1)
        );
        const rank = userData.rankPoint >= 3000
            ? "Phoenix"
            : userData.rankPoint >= 2500
                ? "Loon"
                : userData.rankPoint >= 2000
                    ? "Grebe"
                    : userData.rankPoint >= 1500
                        ? "Swan"
                        : userData.rankPoint >= 1000
                            ? "Teal"
                            : userData.rankPoint >= 500
                                ? "Mallard"
                                : "Duckling";
        const user: User = {
            ...userData,
            level,
            rank,
        };

        return NextResponse.json(
            {
                status: response.status,
                user,
                message: res.message || "User fetched successfully",
            },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        printd("@/app/api/auth/me/route", "Error in GET /auth/me:", err);

        return NextResponse.json(
            { status: 500, user: null, message: `Internal server error: ${err}` },
            { status: 500 }
        );
    }
}
