"use client";

import { UserPreference } from "@/app/userPrefs/userPrefsUtils";
import { Dispatch, SetStateAction } from "react";
import styles from "../settings.module.css";
import { useUserStore } from"../../contexts/UserContext";

type AccountSettingsProps = {
    nextUserPreference: UserPreference;
    setNextUserPreference: Dispatch<SetStateAction<UserPreference>>;
}

// remove later
// eslint-disable-next-line
export default function AccountSettings({ nextUserPreference, setNextUserPreference }: AccountSettingsProps) {
    const user = useUserStore(state => state.user);

    return (
        <div className={`${styles.settingsOptionDisplay} ${styles.accountSettingsDisplay}`}>
            <div className={styles.settingsContentChunk}>
                <h2>Account</h2>
                <p>Username: <span>{user.name}</span></p>
                <p>Email: <span>{user.email}</span></p>
            </div>
        </div>
    )
}