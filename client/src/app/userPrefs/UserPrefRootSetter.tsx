"use client";

import { useUserStore } from "@/app/components/contexts/UserContext";
import { useEffect } from "react";

export default function UserPrefRootSetter() {
    const user = useUserStore(state => state.user);
    const userPreference = user.userPreference;

    useEffect(() => {
        document.documentElement.style.fontSize = `${userPreference.fontSize}px`;
        document.documentElement.style.setProperty('--significant-button-color', userPreference.significantButtonColor);
        document.documentElement.style.setProperty('--significant-button-hover-color', userPreference.significantButtonHoverColor);
    }, [userPreference]);

    return null;
}