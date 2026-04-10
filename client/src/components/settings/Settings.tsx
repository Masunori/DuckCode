"use client";

import { User, UserPreference } from "@/app/userPrefs/userPrefsTypes";
import { PRISTINE_USER_PREFERENCE } from "@/app/userPrefs/userPrefsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useUserStore } from "@/contexts/UserContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import sleep from "@/lib/utils/delay";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import { Paths } from "@/lib/utils/types";
import equal from 'fast-deep-equal';
import React, { useEffect, useState } from "react";
import AccountSettings from "./options/AccountSettings";
import CodeEditorSettings from "./options/CodeEditorSettings";
import GeneralSettings from "./options/GeneralSettings";
import KeyboardShortcutSettings from "./options/KeyboardShortcutSettings";
import styles from './settings.module.css';
import { GENERAL_KEY_BINDINGS, isKeyCombo } from "./settingsUtils";

type SettingsOptionNames = "General" | "Code Editor" | "Keyboard Shortcut Configuration" | "Account";
export type TempAccountInfo = Pick<User, 'name' | 'email' | 'bio' | 'isTwoFactored'>;

export default function Settings() {
    const { isSettingsOpen, openSettings, closeSettings } = useSettings();

    const user = useUserStore(state => state.user);

    // printd("@components/settings/Settings.tsx", `Current user in Settings: ${JSON.stringify(user)}`);

    const setUserField = useUserStore(state => state.setUserField);

    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const setUserPreference = useUserPreferenceStore(state => state.setUserPreference);

    const { openPopupWith } = usePopup();
    const [activeSettingsOption, setActiveSettingsOption] = useState<SettingsOptionNames>("Keyboard Shortcut Configuration");

    // Settings keep track of a previous user preference object and an editable future user preference object.
    // These only exist during the lifetime of Settings. Thus, all unsaved changes will be lost.
    const [nextUserPreference, setNextUserPreference] = useState<UserPreference>(structuredClone(userPreference));
    const [nextUserInfo, setNextUserInfo] = useState<TempAccountInfo>({
        name: user.name,
        email: user.email,
        bio: user.bio,
        isTwoFactored: user.isTwoFactored,
    });

    const handleAccountChange = (key: keyof TempAccountInfo, value: string) => {
        setNextUserInfo(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => { // re-initializes whenever Settings is opened
        setNextUserPreference(structuredClone(userPreference));
    }, [userPreference]);

    // ensure account info is initialized when settings opens or when the user updates
    useEffect(() => {
        if (isSettingsOpen) {
            setNextUserInfo({
                name: user?.name ?? "",
                email: user?.email ?? "",
                bio: user?.bio ?? "",
                isTwoFactored: user?.isTwoFactored ?? false,
            });
        }
    }, [isSettingsOpen, user]);

    // handle Settings's 4 big events: exit, revert, reset, save
    function handleExit() {
        // there is an await sleep(1) because for the code editor theme, an update to the theme will be reflected for all editors (somehow)
        // React states are updated asynchronously, so even if closeSettings()  is called after setNextuserPreference(),
        // the nextuserPreference will not be updated immediately, causing the gameplay code editor to reflect the hypothetical settings value instead of the current settings value.
        // thus, we need to wait for the nextuserPreference to be updated before closing settings, by forcing a sleep of 1ms (a blocking call)
        if (!equal(nextUserPreference, userPreference)) {
            openPopupWith(
                "There are unsaved changes! Do you want to discard changes and close settings?",
                "Discard changes and close settings",
                "Go back to settings",
                async () => {
                    setNextUserPreference(structuredClone(userPreference));
                    await sleep(1);
                    closeSettings();
                },
                () => { }
            );
        } else {
            closeSettings();
        }
    }

    function handleRevert() {
        if (equal(nextUserPreference, userPreference)) {
            openPopupWith(
                "No changes to discard.",
                "Go back to settings",
                null,
                () => { },
                () => { }
            );
        } else {
            openPopupWith(
                "Discard all changes?",
                "Discard",
                "Keep the changes",
                () => {
                    setNextUserPreference(structuredClone(userPreference));
                },
                () => { }
            );
        }
    }

    function handleSave() {
        if (equal(nextUserPreference, userPreference)) {
            openPopupWith(
                "No changes to save.",
                "Go back to settings",
                null,
                () => { },
                () => { }
            );
        } else {
            openPopupWith(
                "Save these changes? If the programming language changed, your editor code will be wiped.",
                "Save changes",
                "Keep the current settings",
                () => {
                    setUserPreference(nextUserPreference);
                    Object.entries(nextUserInfo).forEach(([key, value]) => {
                        setUserField(key as Paths<User>, value);
                    });
                },
                () => { }
            );
        }
    }

    function handleReset() {
        if (equal(userPreference, PRISTINE_USER_PREFERENCE)) {
            openPopupWith(
                "Your settings is the same as the default settings.",
                "Go back to settings",
                null,
                () => { },
                () => { }
            );
        } else {
            openPopupWith(
                "Reset to default settings? If the programming language changes, your editor code will be wiped.",
                "Reset settings to default",
                "Keep the current settings",
                () => {
                    setUserPreference(PRISTINE_USER_PREFERENCE);
                    setNextUserPreference(PRISTINE_USER_PREFERENCE);
                },
                () => { }
            );
        }


    }

    const SETTINGS_OPTIONS: Record<SettingsOptionNames, { component: React.JSX.Element }> = {
        "General": {
            component: <GeneralSettings nextuserPreference={nextUserPreference} setNextuserPreference={setNextUserPreference} />
        },
        "Code Editor": {
            component: <CodeEditorSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
        },
        "Keyboard Shortcut Configuration": {
            component: <KeyboardShortcutSettings />
        },
        "Account": {
            component: <AccountSettings nextUserInfo={nextUserInfo} handleAccountChange={handleAccountChange} />
        }
    }

    // key binding to exit settings
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CLOSE_SETTINGS"].combo) && isSettingsOpen) {
                event.preventDefault();
                handleExit();
                return true;
            } else if (isKeyCombo(event, GENERAL_KEY_BINDINGS["OPEN_SETTINGS"].combo)) {
                event.preventDefault();
                openSettings();
                return true;
            }

            return false;
        }

        keyboardManager.register("settingsExit", "SETTINGS_KEY_PRIORITY", handleEscape);
        return () => {
            keyboardManager.unregister("settingsExit");
        }
    });

    // handle hovering of settings option buttons
    function handleOnMouseEnter(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        (event.target as HTMLLIElement).style.backgroundColor = "var(--settings-bg-color)";
    }

    function handleOnMouseLeave(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        const element = event.target as HTMLLIElement;
        if (element.innerText === activeSettingsOption) {
            return;
        }

        element.style.backgroundColor = "var(--settings-option-bg-color)";
    }

    return (
        <div>
            {isSettingsOpen && (
                <div className={styles.settingsOverlay}>
                    <ul className={styles.settingsOptions}>
                        {Object.keys(SETTINGS_OPTIONS).map((key) => (
                            <li
                                key={key}
                                onClick={() => setActiveSettingsOption(key as SettingsOptionNames)}
                                style={{
                                    backgroundColor: key === activeSettingsOption
                                        ? "var(--settings-bg-color) !important"
                                        : "var(--settings-option-bg-color) !important"
                                }}
                                onMouseEnter={handleOnMouseEnter}
                                onMouseLeave={handleOnMouseLeave}
                            >
                                {key}
                            </li>
                        ))}
                    </ul>
                    {SETTINGS_OPTIONS[activeSettingsOption].component}
                    <div className={styles.settingsFunctionalButtons}>
                        <button className={styles.exitButton} onClick={handleExit}>Exit</button>
                        <button className={''} onClick={handleRevert}>Discard changes</button>
                        <button className={''} onClick={handleReset}>Reset to Default</button>
                        <button className={styles.saveButton} onClick={handleSave}>Save</button>
                    </div>
                </div>
            )}
        </div>
    )
}