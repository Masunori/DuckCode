import React from "react";
import { SettingsProvider } from "../components/contexts/SettingsContext";
import Settings from "../components/settings/Settings";
import { PopupProvider } from "../components/contexts/PopupContext";
import Popup from "../components/popup/Popup";

export default function Layout({ children }: { children: React.ReactNode }) {
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