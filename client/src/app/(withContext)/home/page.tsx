import { PRISTINE_USER } from "@/app/userPrefs/userPrefsUtils"
import HomeNavbar from "./components/HomeNavbar";
import styles from "./page.module.css";
import EventMenu from "./components/EventMenu";
import NewsCaruosel from "./components/NewsCaruosel";
import GameMenu from "./components/GameMenu";
import ChatPanel from "./components/ChatPanel";

export default function Page() {
    const user = PRISTINE_USER;

    return (
        <div className={styles.home}>
            <HomeNavbar user={user} />
            <EventMenu />
            <NewsCaruosel />
            <GameMenu />
            <ChatPanel />
        </div>
    )
}