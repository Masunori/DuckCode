"use client";

import { useUserStore } from "@/app/components/contexts/UserContext";
import HomeNavbar from "./components/HomeNavbar";
import EventMenu from "./components/EventMenu";
import NewsCarousel from "./components/NewsCarousel";
import GameMenu from "./components/GameMenu";
import ChatPanel from "./components/ChatPanel";
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