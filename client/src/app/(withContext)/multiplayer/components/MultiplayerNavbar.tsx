"use client";

import CountdownTimer from "@/app/components/countdownTimer/CountdownTimer";
import Image from "next/image";
import styles from "../page.module.css";
import { useSettings } from "@/app/components/contexts/SettingsContext";
import { useUserStore } from"@/app/components/contexts/UserContext";
import { useRouter } from "next/navigation";
import { GENERAL_KEY_BINDINGS, MULTIPLAYER_KEY_BINDINGS, translateCombo } from "@/app/components/settings/settingsUtils";
import { useChatController } from "../hooks/useChatController";
import { useBoardController } from "../hooks/useBoardController";

type MultiplayerNavbarProps = {
    forceSubmitOnCountdownEnds?: () => void;
}

export default function MultiplayerNavbar({ forceSubmitOnCountdownEnds = () => {} }: MultiplayerNavbarProps) {
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
            <CountdownTimer 
                initialTime={900} 
                onCountdownEnds={forceSubmitOnCountdownEnds}
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