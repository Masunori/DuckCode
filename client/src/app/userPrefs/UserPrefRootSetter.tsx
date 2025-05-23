"use client";

import { useUser } from "@/app/components/contexts/UserContext";
import { useEffect } from "react";

export default function UserPrefRootSetter() {
    const { user } = useUser();
    const userPreference = user.userPreference;

    useEffect(() => {
        document.documentElement.style.fontSize = `${userPreference.fontSize}px`;
    }, [userPreference]);

    return null;
}