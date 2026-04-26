"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/contexts/UserContext";
import ChatPanel from "./components/ChatPanel";
import EventMenu from "./components/EventMenu";
import GameMenu from "./components/GameMenu";
import HomeNavbar from "./components/HomeNavbar";
import NewsCarousel from "./components/NewsCarousel";
import styles from "./page.module.css";

export default function HomeClient() {
    const router = useRouter();
    const user = useUserStore(state => state.user);
    const userExp = useUserStore(state => state.user.exp);
    const isUserInitialized = useUserStore(state => state.isUserInitialized);

    useEffect(() => {
        if (!isUserInitialized) {
            return;
        }

        if (userExp === 0) {
            router.replace("/getting-started");
        }
    }, [isUserInitialized, userExp, router]);

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