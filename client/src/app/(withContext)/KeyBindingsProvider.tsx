"use client";

import { useEffect } from "react";
import { keyboardManager } from "../utils/keyboardManager";
import { User } from "../userPrefs/userPrefsUtils";
import { useUserStore } from "../components/contexts/UserContext";

type KeyBindingProviderProps = {
    children: React.ReactNode;
    user: User;
}

export default function KeyBindingsProvider({ children, user }: KeyBindingProviderProps) {
    // binds keyboard manager to keydown events
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            keyboardManager.handleEvent(event);
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    });

    // hydrates user
    const setUser = useUserStore(state => state.setUser);
    useEffect(() => {
        setUser(user);
    })
    
    return (
        <>
            {children}
        </>
    )
}