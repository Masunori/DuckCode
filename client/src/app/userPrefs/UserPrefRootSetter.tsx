"use client";

import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useEffect } from "react";

export default function UserPrefRootSetter() {
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    useEffect(() => {
        document.documentElement.style.fontSize = `${userPreference.fontSize}px`;
        document.documentElement.style.setProperty('--significant-button-color', userPreference.significantButtonColor);
        document.documentElement.style.setProperty('--significant-button-hover-color', userPreference.significantButtonHoverColor);
    }, [userPreference.fontSize, userPreference.significantButtonColor, userPreference.significantButtonHoverColor]);

    return null;
}