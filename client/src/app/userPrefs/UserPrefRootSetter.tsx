"use client";

import { useUser } from "@/app/components/contexts/UserContext";
import { useEffect } from "react";

export default function UserPrefRootSetter() {
    const { user } = useUser();
    const userPreference = user.userPreference;

    useEffect(() => {
        document.documentElement.style.fontSize = `${userPreference.fontSize}px`;
        document.documentElement.style.setProperty('--significant-button-color', userPreference.significantButtonColor);
        document.documentElement.style.setProperty('--significant-button-hover-color', userPreference.significantButtonHoverColor);
    }, [userPreference]);

    return null;
}