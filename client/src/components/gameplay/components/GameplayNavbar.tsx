"use client";

import DropdownInput from "@/components/inputs/DropdownInput";
import { PLKeys, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import CountdownTimer from "@/components/countdownTimer/CountdownTimer";
import { usePopup } from "@/contexts/PopupContext";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";

type GameplayNavbarProps = {
    initialTime: number;
    forceSubmitOnCountdownEnds?: () => void;
}

export default function GameplayNavbar({ initialTime, forceSubmitOnCountdownEnds = () => { } }: GameplayNavbarProps) {
    const { openSettings } = useSettings();
    const { openPopupWith } = usePopup();
    const reset = useBaseGameplayStore(state => state.reset);

    const router = useRouter();

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const setUserPreference = useUserPreferenceStore(state => state.setUserPreference);

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
                reset();
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
            </button>
            <CountdownTimer
                initialTime={initialTime}
                onCountdownEnds={forceSubmitOnCountdownEnds}
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