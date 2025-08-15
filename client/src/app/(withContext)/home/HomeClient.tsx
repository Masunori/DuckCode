"use client";

import { useUserStore } from "@/app/components/contexts/UserContext";
import { User } from "@/app/userPrefs/userPrefsUtils";
import HomeNavbar from "./components/HomeNavbar";
import EventMenu from "./components/EventMenu";
import NewsCarousel from "./components/NewsCarousel";
import GameMenu from "./components/GameMenu";
import ChatPanel from "./components/ChatPanel";

import styles from "./page.module.css";

export default function HomeClient({ user }: { user: User }) {
    const setUser = useUserStore(state => state.setUser);

    // remove for production code
    setUser(user);

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