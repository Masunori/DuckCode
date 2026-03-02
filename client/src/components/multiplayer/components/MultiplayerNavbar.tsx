"use client";

import { GENERAL_KEY_BINDINGS, MULTIPLAYER_KEY_BINDINGS, translateCombo } from "@/components/settings/settingsUtils";
import CountdownTimer from "@/components/countdownTimer/CountdownTimer";
import { useSettings } from "@/contexts/SettingsContext";
import { useUserStore } from "@/contexts/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";
import { usePopup } from "@/contexts/PopupContext";

type MultiplayerNavbarProps = {
    initialTime: number;
    forceSubmitOnCountdownEnds?: () => void;
}

function MatchInformation({ initialTime, forceSubmitOnCountdownEnds }: MultiplayerNavbarProps) {
    return (
        <div className={styles.matchInformation}>
            <div className={styles.teamAvatars}>
                <div className={styles.avatar}>

                </div>
                <div className={styles.avatar}>

                </div>
                <div className={styles.avatar}>

                </div>
            </div>
            <div className={styles.matchTimerAndProgress}>
                <CountdownTimer
                    initialTime={initialTime}
                    onCountdownEnds={forceSubmitOnCountdownEnds}
                />
                <div className={styles.matchProgress}>
                    <p>60%</p>
                    <p>40%</p>
                </div>
            </div>
            <div className={styles.opponentAvatars}>
                <div className={styles.avatar}>

                </div>
                <div className={styles.avatar}>

                </div>
                <div className={styles.avatar}>

                </div>
            </div>
        </div>
    )
}

export default function MultiplayerNavbar({ initialTime, forceSubmitOnCountdownEnds = () => { } }: MultiplayerNavbarProps) {
    const { openSettings } = useSettings();
    const user = useUserStore(state => state.user);
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const setIsChatboxOpen = useMultiplayerGameplayStore(state => state.setIsChatboxOpen);
    const setIsBoardOpen = useMultiplayerGameplayStore(state => state.setIsBoardOpen);
    const reset = useMultiplayerGameplayStore(state => state.reset);

    const router = useRouter();
    const { openPopupWith } = usePopup();

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
            <div className={styles.navbarButtons}>
                <button onClick={openSettings} title="Open Settings">
                    <Image
                        src={'/icons/settings.png'}
                        alt="settings"
                        width={userPreference.fontSize * 1.5}
                        height={userPreference.fontSize * 1.5}
                    />
                    <p>
                        [{translateCombo(GENERAL_KEY_BINDINGS["OPEN_SETTINGS"].combo)}]
                    </p>
                </button>
                <button onClick={() => setIsChatboxOpen(true)} title="Open Chatbox">
                    <Image
                        src={"/icons/chatbox.png"}
                        alt="open chatbox"
                        width={userPreference.fontSize * 1.5}
                        height={userPreference.fontSize * 1.5}
                    />
                    <p>
                        [{translateCombo(MULTIPLAYER_KEY_BINDINGS["OPEN_CHATBOX"].combo)}]
                    </p>
                </button>
                <button onClick={() => setIsBoardOpen(prev => !prev)} title="Toggle Strategy Board">
                    <Image
                        src={"/icons/board.png"}
                        alt="toggle strategy board"
                        width={userPreference.fontSize * 1.5}
                        height={userPreference.fontSize * 1.5}
                    />
                    <p>
                        [{translateCombo(MULTIPLAYER_KEY_BINDINGS["TOGGLE_CANVAS"].combo)}]
                    </p>
                </button>
            </div>
            <MatchInformation
                initialTime={initialTime}
                forceSubmitOnCountdownEnds={forceSubmitOnCountdownEnds}
            />
            <div className={styles.programmingLanguage}>
                Programming Language: {userPreference.language}
            </div>
            <button className={styles.toHome} onClick={exit}>
                Exit
            </button>
        </nav>
    )
}