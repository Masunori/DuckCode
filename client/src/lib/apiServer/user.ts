import { decodeUserPrefs } from "@/app/userPrefs/userPrefSerializer";
import { PRISTINE_USER_PREFERENCE, User } from "@/app/userPrefs/userPrefsUtils";
import { cookies } from "next/headers";

export async function getProfile() {
    try {
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
            credentials: 'include',
        });

        if (!response.ok) {
            return {
                status: response.status,
                data: null,
            }
        }
    
        const data = await response.json();
        const user = data.user;

        user.userPreference = user.userPreference === ""
            ? structuredClone(PRISTINE_USER_PREFERENCE)
            : decodeUserPrefs(user.userPreference as string);
    
        return {
            status: response.status,
            data: user as User,
        }
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw error;
    }
}