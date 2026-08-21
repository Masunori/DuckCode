import { printd } from "@/utils/debugUtils";

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

        printd("@/services/apiClient/user", "Updating profile with data:", body);

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