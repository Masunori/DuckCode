"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import KeyboardShortcutSettings from "./options/KeyboardShortcutSettings";
import styles from './settings.module.css';
import GeneralSettings from "./options/GeneralSettings";
import CodeEditorSettings from "./options/CodeEditorSettings";
import { GENERAL_KEY_BINDINGS, isKeyCombo } from "./settingsUtils";
import { PRISTINE_USER_PREFERENCE, UserPreference } from "@/app/userPrefs/userPrefsUtils";
import { useUserStore } from "../contexts/UserContext";
import { usePopup } from "../contexts/PopupContext";
import equal from 'fast-deep-equal';
import { keyboardManager, SETTINGS_KEY_PRIORITY } from "@/app/utils/keyboardManager";
import sleep from "@/app/utils/delay";
import AccountSettings from "./options/AccountSettings";

type SettingsOptionNames = "General" | "Code Editor" | "Keyboard Shortcut Configuration" | "Account";

export default function Settings() {
    const { isSettingsOpen, closeSettings } = useSettings();

    const user = useUserStore(state => state.user);
    const setUserField = useUserStore(state => state.setUserField);

    const { openPopupWith } = usePopup();
    const [activeSettingsOption, setActiveSettingsOption] = useState<SettingsOptionNames>("Keyboard Shortcut Configuration");

    // Settings keep track of a previous user preference object and an editable future user preference object.
    // These only exist during the lifetime of Settings. Thus, all unsaved changes will be lost.
    const [nextUserPreference, setNextUserPreference] = useState<UserPreference>(structuredClone(user.userPreference));

    function setUserPreference(userPreference: UserPreference) {
        setUserField("userPreference", userPreference);
    }

    useEffect(() => { // re-initializes whenever Settings is opened
        setNextUserPreference(structuredClone(user.userPreference));
    }, [user.userPreference]);

    // handle Settings's 4 big events: exit, revert, reset, save
    function handleExit() {
        // there is an await sleep(1) because for the code editor theme, an update to the theme will be reflected for all editors (somehow)
        // React states are updated asynchronously, so even if closeSettings()  is called after setNextUserPreference(),
        // the nextUserPreference will not be updated immediately, causing the gameplay code editor to reflect the hypothetical settings value instead of the current settings value.
        // thus, we need to wait for the nextUserPreference to be updated before closing settings, by forcing a sleep of 1ms (a blocking call)
        if (!equal(nextUserPreference, user.userPreference)) {
            openPopupWith(
                "There are unsaved changes! Do you want to discard changes and close settings?",
                "Discard changes and close settings",
                "Go back to settings",
                async () => {
                    setNextUserPreference(structuredClone(user.userPreference));
                    await sleep(1);
                    closeSettings();
                },
                () => {}
            );
        } else {
            closeSettings();
        }
    }

    function handleRevert() {
        if (equal(nextUserPreference, user.userPreference)) {
            openPopupWith(
                "No changes to discard.",
                "Go back to settings",
                null,
                () => {},
                () => {}
            );
        } else {
            openPopupWith(
                "Discard all changes?",
                "Discard",
                "Keep the changes",
                () => {
                    setNextUserPreference(structuredClone(user.userPreference));
                },
                () => {}
            );
        }
    }

    function handleSave() {
        if (equal(nextUserPreference, user.userPreference)) {
            openPopupWith(
                "No changes to save.",
                "Go back to settings",
                null,
                () => {},
                () => {}
            );
        } else {
            openPopupWith(
                "Saving will overwrite the current settings with your new changes and wipe all code from your editor (if you are in a match). This action can't be undone.",
                "Save changes",
                "Keep the current settings",
                () => {
                    setUserPreference(nextUserPreference);
                },
                () => {}
            );
        }
    }

    function handleReset() {
        if (equal(user.userPreference, PRISTINE_USER_PREFERENCE)) {
            openPopupWith(
                "Your settings is the same as the default settings.",
                "Go back to settings",
                null,
                () => {},
                () => {}
            );
        } else {
            openPopupWith(
                "Resetting will overwrite the current settings with the default settings and wipe all code from your editor (if you are in a match). This action can't be undone.",
                "Reset settings to default",
                "Keep the current settings",
                () => {
                    setUserPreference(PRISTINE_USER_PREFERENCE);
                    setNextUserPreference(PRISTINE_USER_PREFERENCE);
                },
                () => {}
            );
        }


    }

    const SETTINGS_OPTIONS: Record<SettingsOptionNames, { component: React.JSX.Element }> = {
        "General": {
            component: <GeneralSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
        },
        "Code Editor": {
            component: <CodeEditorSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
        },
        "Keyboard Shortcut Configuration": {
            component: <KeyboardShortcutSettings />
        },
        "Account": {
            component: <AccountSettings nextUserPreference={nextUserPreference} setNextUserPreference={setNextUserPreference} />
        }
    }

    // key binding to exit settings
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CLOSE_SETTINGS"].combo) && isSettingsOpen) {
                handleExit();
                return true;
            }

            return false;
        }

        keyboardManager.register("settingsExit", SETTINGS_KEY_PRIORITY, handleEscape);
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