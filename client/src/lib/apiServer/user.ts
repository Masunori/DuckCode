import { User } from "@/app/userPrefs/userPrefsTypes";
import { cookies } from "next/headers";
import { printd } from "../utils/debugUtils";

export async function getProfile() {
    try {
        printd("@/lib/apiServer/user.ts", "Attempting to fetch user profile...");
        const accessToken = (await cookies()).get('accessToken')?.value;
        const refreshToken = (await cookies()).get('refreshToken')?.value;


        const cookieHeader = JSON.stringify({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return {
                status: response.status,
                data: null,
            }
        }

        const data = await response.json();
        const user = data.user;

        // user.level = Math.ceil((user.exp / 100));
        user.level = Math.floor(Math.log10((user.exp / 100) + 1) / Math.log10(1.1));
        user.rank = user.rankPoints >= 3000
            ? "Tourist"
            : user.rankPoints >= 2500
                ? "Diamond"
                : user.rankPoints >= 2000
                    ? "Platinum"
                    : user.rankPoints >= 1500
                        ? "Gold"
                        : user.rankPoints >= 1000
                            ? "Silver"
                            : user.rankPoints >= 500
                                ? "Bronze"
                                : "Vinh";

        return {
            status: response.status,
            data: user as User,
        }
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw error;
    }
}