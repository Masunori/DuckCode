import { UserPreference } from "@/app/userPrefs/userPrefsUtils";
import NumberInput from "../../inputs/NumberInput";
import styles from "../settings.module.css";
import { Dispatch, SetStateAction } from "react";

type GeneralSettingsPrompt = {
    nextUserPreference: UserPreference;
    setNextUserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function GeneralSettings({ nextUserPreference, setNextUserPreference }: GeneralSettingsPrompt) {
    return (
        <div
            className={styles.settingsOptionDisplay}
        >
            <div className={styles.settingsContentChunk}>
                <NumberInput 
                    inputId="font-size"
                    defaultValue={nextUserPreference.fontSize}
                    min={10}
                    max={32}
                    increment={5}
                    inputName="Font Size (also applicable to code editor)"
                    handleInputChange={option => {
                        setNextUserPreference({
                            ...nextUserPreference,
                            fontSize: option,
                        })
                    }}
                />
            </div>
        </div>
    )
}