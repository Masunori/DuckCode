"use client";

import { loadUserPreference, saveUserPreference } from "./userPrefStorage";
import { useEffect } from "react";
import { getDefaultUserPreference } from "./userPrefsUtils";
import UserPrefRootSetter from "./UserPrefRootSetter";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";

export default function UserPrefInitializer() {
    const setUserPreference = useUserPreferenceStore(state => state.setUserPreference);
        
    useEffect(() => {
        const userPreference = loadUserPreference();
        setUserPreference(userPreference ?? getDefaultUserPreference());
    }, []);

    useEffect(() => {
        const unsubscribe = useUserPreferenceStore.subscribe(
            (state) => state.userPreference,
            (userPreference) => {
                saveUserPreference(userPreference);
            }
        )

        return () => unsubscribe();
    }, []);

    return <UserPrefRootSetter />
}