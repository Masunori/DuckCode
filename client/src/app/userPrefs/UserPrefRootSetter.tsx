"use client";

import { COLOR_ACCESSIBILITY_PALETTES } from "@/components/themes/colorAccessibilityPalettes";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { toGrayscale } from "@/lib/utils/colors";
import { palette } from "@excalidraw/excalidraw/components/icons";
import { useEffect } from "react";

export default function UserPrefRootSetter() {
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    useEffect(() => {
        const root = document.documentElement;

        document.documentElement.style.fontSize = `${userPreference.fontSize}px`;
        document.documentElement.style.setProperty('--significant-button-color', userPreference.significantButtonColor);
        document.documentElement.style.setProperty('--significant-button-hover-color', userPreference.significantButtonHoverColor);

        const palette = COLOR_ACCESSIBILITY_PALETTES[userPreference.colorAccessibilityMode];
        const correctIndicatorColor = palette.correct;
        const wrongIndicatorColor = palette.wrong;
        const correctOnHoverIndicatorColor = palette.correctOnHover;
        const wrongOnHoverIndicatorColor = palette.wrongOnHover;

        root.style.setProperty("--correct-indicator-color", correctIndicatorColor);
        root.style.setProperty("--wrong-indicator-color", wrongIndicatorColor);
        root.style.setProperty("--correct-on-hover-indicator-color", correctOnHoverIndicatorColor);
        root.style.setProperty("--wrong-on-hover-indicator-color", wrongOnHoverIndicatorColor);

        root.style.setProperty("--correct-indicator-text-color", toGrayscale(correctIndicatorColor) < 128 ? "#fff" : "#222");
        root.style.setProperty("--wrong-indicator-text-color", toGrayscale(wrongIndicatorColor) < 128 ? "#fff" : "#222");
        root.style.setProperty("--correct-on-hover-indicator-text-color", toGrayscale(correctOnHoverIndicatorColor) < 128 ? "#fff" : "#222");
        root.style.setProperty("--wrong-on-hover-indicator-text-color", toGrayscale(wrongOnHoverIndicatorColor) < 128 ? "#fff" : "#222");
    }, [userPreference.fontSize, userPreference.significantButtonColor, userPreference.significantButtonHoverColor, userPreference.colorAccessibilityMode]);

    return null;
}