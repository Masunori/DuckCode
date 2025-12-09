"use client";

import { refresh } from "@/lib/apiClient/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * This component handles refreshing the authentication tokens on the client side.
 * It calls the refresh API and then refreshes the router to set new cookies.
 * 
 * @returns null
 */
export default function RefreshClient() {
    const router = useRouter();

    useEffect(() => {
        async function run() {
            await refresh();

            router.refresh();
        }

        run();
    }, []);

    return null;
}