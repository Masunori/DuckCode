"use client";

import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { PRISTINE_USER, User } from "@/app/userPrefs/userPrefsUtils";

type UserContextType = {
    user: User;
    setUser: Dispatch<SetStateAction<User>>
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(structuredClone(PRISTINE_USER)); 

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used inside a UserProvider');
    }
    return ctx;
}