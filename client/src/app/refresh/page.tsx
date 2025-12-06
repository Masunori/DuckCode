"use client";

import { refresh } from "@/lib/apiServer/user";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const params = useSearchParams();

    useEffect(() => {
        const next = params.get("next") || "/";

        async function refreshTokens() {
            try {
                const res = await refresh();

                if (res.status === 200) {
                    window.location.href = next;
                } else {
                    window.location.href = "/portal";
                }
            } catch {
                window.location.href = "/portal";
            }
        }

        refreshTokens();
    }, [params]);

    return (
        <div>
            Refreshing...
        </div>
    )
}