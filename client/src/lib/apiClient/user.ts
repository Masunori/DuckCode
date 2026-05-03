import { User } from "@/app/userPrefs/userPrefsTypes";
import { printd } from "../utils/debugUtils";

export async function login(email: string, password: string) {
    const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        // credentials: "include",
    });

    type Response = {
        data: {
            accessToken: string;
            refreshToken: string;
        },
        message: string;
    }

    const data: Response = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function signUp(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
) {
    const response = await fetch("/api/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userData: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getVerificationCode(email: string) {
    const response = await fetch("api/auth/request-otp", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function verifyCode(email: string, code: string) {
    const response = await fetch("/api/auth/verify-otp", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            inputOTP: code,
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function verifyNewPassword(
    email: string,
    password: string,
    confirmPassword: string
) {
    const response = await fetch("/api/auth/reset-password", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            newPassword: password,
            newConfirmedPassword: confirmPassword
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getCookies() {
    const response = await fetch("/api/cookies", {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function refresh() {
    try {
        const response = await fetch(`/api/auth/refresh-token`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        

        return response;
    } catch (error) {
        console.error('Error in refreshToken:', error);
        throw error;
    }
}

export async function updateProfile(
    username: string,
    bio: string,
    profilePicture: string = ""
) {
    try {
        const body = {
            name: username,
            bio: bio,
            profilePicture: profilePicture,
        }

        printd("@/lib/apiClient/user", "Updating profile with data:", body);

        const response = await fetch("/api/user/update-profile", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: "include",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return {
            status: response.status,
            data
        };

    } catch (error) {
        console.error('Error in updateProfile:', error);
        throw error;
    }
}

export async function changePassword(
    currentPassword: string,
    newPassword: string,
    newConfirmedPassword: string
) {
    try {
        const body = {
            currentPassword,
            newPassword,
            newConfirmedPassword,
        };

        printd("@/lib/apiClient/user", "Changing password with data:", body);

        const response = await fetch("/api/auth/change-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: "include",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return {
            status: response.status,
            data
        };
    } catch (error) {
        console.error('Error in changePassword:', error);
        throw error;
    }
}

export async function getProfile() {
    try {
        // printd("@/lib/apiServer/user.ts", "Attempting to fetch user profile...");
        const response = await fetch(`/api/auth/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                credentials: "include",
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

        printd("@/lib/apiClient/user", "Fetched user profile data:", data);

        const user = data.user;

        // user.level = Math.ceil((user.exp / 100));
        user.level = Math.floor(Math.log10((user.exp / 100) + 1) / Math.log10(1.1));
        user.rank = user.rankPoints >= 3000
            ? "Phoenix"
            : user.rankPoints >= 2500
                ? "Loon"
                : user.rankPoints >= 2000
                    ? "Grebe"
                    : user.rankPoints >= 1500
                        ? "Swan"
                        : user.rankPoints >= 1000
                            ? "Teal"
                            : user.rankPoints >= 500
                                ? "Mallard"
                                : "Duckling";

        return {
            status: response.status,
            data: user as User,
        }
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw error;
    }
}