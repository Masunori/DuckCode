"use client";

import { SettingsProvider } from "../components/contexts/SettingsContext";
import Settings from "../components/settings/Settings";
import { PopupProvider } from "../components/contexts/PopupContext";
import Popup from "../components/popup/Popup";
import { keyboardManager } from "../utils/keyboardManager";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            keyboardManager.handleEvent(event);
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    })

    return (
        <PopupProvider>
            <Popup />
            <SettingsProvider>
                <Settings />
                {children}
            </SettingsProvider>
        </PopupProvider>
    )
}