"use client";

import { GENERAL_KEY_BINDINGS, MULTIPLAYER_KEY_BINDINGS, translateCombo } from "@/components/settings/settingsUtils";
import CountdownTimer from "@/components/countdownTimer/CountdownTimer";
import { useSettings } from "@/contexts/SettingsContext";
import { useUserStore } from "@/contexts/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBoardController } from "../hooks/useBoardController";
import { useChatController } from "../hooks/useChatController";
import styles from "../page.module.css";

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
    const setIsChatboxOpen = useChatController(state => state.setIsChatboxOpen);
    const setIsBoardOpen = useBoardController(state => state.setIsBoardOpen);

    const router = useRouter();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarButtons}>
                <button onClick={openSettings} title="Open Settings">
                    <Image
                        src={'/icons/settings.png'}
                        alt="settings"
                        width={user.userPreference.fontSize * 1.5}
                        height={user.userPreference.fontSize * 1.5}
                    />
                    <p>
                        [{translateCombo(GENERAL_KEY_BINDINGS["OPEN_SETTINGS"].combo)}]
                    </p>
                </button>
                <button onClick={() => setIsChatboxOpen(true)} title="Open Chatbox">
                    <Image
                        src={"/icons/chatbox.png"}
                        alt="open chatbox"
                        width={user.userPreference.fontSize * 1.5}
                        height={user.userPreference.fontSize * 1.5}
                    />
                    <p>
                        [{translateCombo(MULTIPLAYER_KEY_BINDINGS["OPEN_CHATBOX"].combo)}]
                    </p>
                </button>
                <button onClick={() => setIsBoardOpen(prev => !prev)} title="Toggle Strategy Board">
                    <Image
                        src={"/icons/board.png"}
                        alt="toggle strategy board"
                        width={user.userPreference.fontSize * 1.5}
                        height={user.userPreference.fontSize * 1.5}
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
                Programming Language: {user.userPreference.language}
            </div>
            <button className={styles.toHome} onClick={() => router.push("/home")}>
                Exit
            </button>
        </nav>
    )
}