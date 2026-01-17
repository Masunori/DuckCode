"use client";

import { useUserStore } from "@/contexts/UserContext";
import ChatPanel from "./components/ChatPanel";
import EventMenu from "./components/EventMenu";
import GameMenu from "./components/GameMenu";
import HomeNavbar from "./components/HomeNavbar";
import NewsCarousel from "./components/NewsCarousel";
import styles from "./page.module.css";

export default function HomeClient() {
    const user = useUserStore(state => state.user);

    return (
        <div className={styles.home}>
            <HomeNavbar user={user} />
            <EventMenu />
            <NewsCarousel />
            <GameMenu />
            <ChatPanel />
        </div>
    )
}