"use client";

import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { PRISTINE_USER, User, UserPath } from "@/app/userPrefs/userPrefsUtils";

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

function setNested< S>(obj: User, path: UserPath, value: S): T {
    const keys = path.split('.');
    const newObj = structuredClone(obj);
    let curr = newObj;

    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];

        if (!(k in curr)) {
            throw new Error(`Property ${path} does not exist on user object.`);
        }

        curr = curr[k];
    }

    return newObj;
}