import CountdownTimer from "@/app/components/countdownTimer/CountdownTimer";
import Image from "next/image";
import styles from "../page.module.css";
import { useSettings } from "@/app/components/contexts/SettingsContext";
import { useUser } from "@/app/components/contexts/UserContext";
import DropdownInput from "@/app/components/inputs/DropdownInput";
import { PLKeys, PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { usePopup } from "@/app/components/contexts/PopupContext";
import { UserPreference } from "../../../userPrefs/userPrefsUtils";
import { useRouter } from "next/navigation";

export default function GameplayNavbar() {
    const { openSettings } = useSettings();
    const { user, setUser } = useUser();
    const { openPopupWith } = usePopup();

    const router = useRouter();

    const options = Object.entries(PROGRAMMING_LANGUAGES).map(([plkey, value]) => `${plkey} (${value.version})`);
    const extractPLKey = (str: string) => str.split(" ")[0];

    function setUserPreference(userPreference: UserPreference) {
        setUser({
            ...user,
            userPreference: userPreference
        })
    }

    function handleOptionChange(option: string) {
        openPopupWith(
            "Warning: This will delete all code in the editor.",
            "Change language",
            "Keep the current language",
            () => {
                setUserPreference({
                    ...user.userPreference,
                    language: extractPLKey(option) as PLKeys
                })
            },
            () => {}
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
            <CountdownTimer initialTime={900} />
            <DropdownInput
                options={options}
                defaultOption={`${user.userPreference.language} (${PROGRAMMING_LANGUAGES[user.userPreference.language].version})`}
                inputId="quick-programming-language-options"
                dropdownName="Programming Language"
                handleOptionChange={handleOptionChange}
            />
            <button className={styles.toHome} onClick={() => router.push("/home")}>
                Exit
            </button>
        </nav>
    )
}