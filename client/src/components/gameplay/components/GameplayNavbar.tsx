"use client";

import DropdownInput from "@/components/inputs/DropdownInput";
import { GENERAL_KEY_BINDINGS, translateCombo } from '@/lib/utils/keyBindings';
import { usePopup } from "@/contexts/PopupContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import CountupTimer, { CountupTimerRef } from "@/components/timer/CountupTimer";
import { useTimerStore } from "@/hooks/useTimerStore";
import { PLKeys, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";

export default function GameplayNavbar() {    
    const { openSettings } = useSettings();
    const { openPopupWith } = usePopup();
    const resetGameplay = useBaseGameplayStore(state => state.reset);
    const isPaused = useTimerStore(state => state.isPaused);
    const resetTimer = useTimerStore(state => state.reset);

    const setTimeElapsed = useTimerStore(state => state.setTimeElapsed);

    const router = useRouter();

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const setUserPreference = useUserPreferenceStore(state => state.setUserPreference);

    
    const settingsKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GENERAL_KEY_BINDINGS["OPEN_SETTINGS"].combo)}]</kbd>
        : "";

    function handleOptionChange(option: string) {
        openPopupWith(
            "Warning: This will delete all code in the editor.",
            "Change language",
            "Keep the current language",
            () => {
                setUserPreference({
                    ...userPreference,
                    language: extractPLKey(option) as PLKeys
                })
            },
            () => { }
        )
    }

    function exit() {
        openPopupWith(
            "Are you sure you want to exit? Your current progress will be lost.",
            "Exit",
            "Stay",
            () => {
                resetGameplay();
                resetTimer();
                router.push("/home");
            },
            () => { }
        )
    }

    return (
        <nav className={styles.navbar}>
            <button className={styles.toSettings} onClick={openSettings}>
                <Image
                    src={'/icons/settings.png'}
                    alt="settings"
                    width={userPreference.fontSize * 1.25}
                    height={userPreference.fontSize * 1.25}
                />
                {settingsKeyHint}
            </button>
            <CountupTimer 
                initialTime={useTimerStore.getState().timeElapsed}
                isPaused={isPaused}
                onTimeElapsedChange={setTimeElapsed}
            />
            <DropdownInput
                options={options}
                defaultOption={`${userPreference.language} (${PROGRAMMING_LANGUAGES[userPreference.language].version})`}
                inputId="quick-programming-language-options"
                dropdownName="Programming Language"
                handleOptionChange={handleOptionChange}
            />
            <button className={styles.toHome} onClick={exit}>
                Exit
            </button>
        </nav>
    )
}