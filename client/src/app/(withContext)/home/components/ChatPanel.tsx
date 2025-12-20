import styles from "../page.module.css";

export default function ChatPanel() {
    return (
        <div className={styles.chatPanel}>
            <div className={styles.messagesBox}>

            </div>
            <button className={styles.worldChatButton}>World</button>
            <button className={styles.clanChatButton}>Clan</button>
            <button className={styles.teamChatButton}>Team</button>
            <button className={styles.pmChatButton}>PM</button>
        </div>
    )
}