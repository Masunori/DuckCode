import DropdownInput from "@/components/inputs/DropdownInput";
import { PLKeys, PROGRAMMING_LANGUAGES } from "@/utils/settings";
import { usePopup } from "@/contexts/PopupContext";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { GAMEPLAY_KEY_BINDINGS } from "@/utils/keyBindings";

export default function GameplayNavbar({ isKeyBindingEnabled }: { isKeyBindingEnabled: boolean }) {    
    const { openSettings } = useSettings();
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const setUserPreferenceField = useUserPreferenceStore(state => state.setUserPreferenceField);
    const { openPopupWith } = usePopup();

    const router = useRouter();

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];

    function handleOptionChange(option: string) {
        openPopupWith(
            "Warning: This will delete all code in the editor.",
            "Change language",
            "Keep the current language",
            () => {
                setUserPreferenceField("language", extractPLKey(option) as PLKeys);
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
                    width={20}
                    height={20}
                />
            </button>
            <div className={styles.programmingLanguageDropdown}>
                <DropdownInput
                    options={options}
                    defaultOption={`${userPreference.language} (${PROGRAMMING_LANGUAGES[userPreference.language].version})`}
                    inputId="quick-programming-language-options"
                    dropdownName="Programming Language"
                    handleOptionChange={handleOptionChange}
                    keyBinding={isKeyBindingEnabled ? GAMEPLAY_KEY_BINDINGS["PROGRAMMING_LANGUAGE_TOGGLE"].combo : undefined}
                />
            </div>
            <button className={styles.toHome} onClick={() => router.push("/home")}>
                Exit
            </button>
        </nav>
    )
}