'use client';

import React, { createContext, useContext, useState } from "react";

type SettingsContextType = {
    isSettingsOpen: boolean;
    toggleSettings: () => void;
    openSettings: () => void;
    closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleSettings = () => setIsSettingsOpen(prev => !prev);
    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    return (
        <SettingsContext.Provider value={{ isSettingsOpen, toggleSettings, openSettings, closeSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error('useSettings must be used inside a SettingsProvider');
    }
    return ctx;
}