import Image from "next/image";
import styles from "../page.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { SetState } from "@/utils/types";

type PanelType = "world" | "clan" | "team" | "pm";

type ChatPanelProps = {
    isPanelExpanded: boolean;
    onExpandedChange: SetState<boolean>;
}

export default function ChatPanel({ isPanelExpanded, onExpandedChange }: ChatPanelProps) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const imageSize = userPreference.fontSize || 16;

    return (
        <div className={`${styles.chatPanel} ${isPanelExpanded ? styles.expanded : styles.minimized}`}>
            <button className={styles.resizePanel} onClick={() => onExpandedChange(prev => !prev)}>
                {
                    isPanelExpanded 
                    ? <Image src={"/icons/minimize.png"} alt="Expand" width={imageSize} height={imageSize} />
                    : <Image src={"/icons/expand.png"} alt="Minimize" width={imageSize} height={imageSize} />
                }
            </button>
            <div className={styles.messagesBox}>

            </div>
            <button className={`${styles.chatButton} ${styles.world}`}>World</button>
            <button className={`${styles.chatButton} ${styles.clan}`}>Clan</button>
            <button className={`${styles.chatButton} ${styles.team}`}>Team</button>
            <button className={`${styles.chatButton} ${styles.pm}`}>PM</button>
        </div>
    )
}