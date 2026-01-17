import DropdownInput from "@/components/inputs/DropdownInput";
import { PLKeys, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { usePopup } from "@/contexts/PopupContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useUserStore } from "@/contexts/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";

export default function GameplayNavbar() {
    const { openSettings } = useSettings();
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const setUserPreference = useUserPreferenceStore(state => state.setUserPreference);
    const setUserField = useUserStore(state => state.setUserField);
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
                setUserPreference({
                    ...userPreference,
                    language: extractPLKey(option) as PLKeys
                })
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
                />
            </div>
            <button className={styles.toHome} onClick={() => router.push("/home")}>
                Exit
            </button>
        </nav>
    )
}