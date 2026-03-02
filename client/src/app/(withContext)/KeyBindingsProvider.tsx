"use client";

import { useEffect } from "react";
import { keyboardManager } from "../../lib/utils/keyboardManager";

type KeyBindingProviderProps = {
    children: React.ReactNode;
}

export default function KeyBindingsProvider({ children }: KeyBindingProviderProps) {
    // binds keyboard manager to keydown events
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            keyboardManager.handleEvent(event);
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    return (
        <>
            {children}
        </>
    )
}