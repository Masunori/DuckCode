import { PRISTINE_USER, User } from "@/app/userPrefs/userPrefsUtils"
import HomeNavbar from "./components/HomeNavbar";
import styles from "./page.module.css";
import EventMenu from "./components/EventMenu";
import NewsCarousel from "./components/NewsCarousel";
import GameMenu from "./components/GameMenu";
import ChatPanel from "./components/ChatPanel";
import { useUserStore } from "@/app/components/contexts/UserContext";
import { getProfile } from "@/lib/apiClient/user";
import { redirect } from "next/navigation";

export default async function Page() {
    // const user = useUserStore(state => state.user);
    const response = await getProfile();
    console.log(response);

    if (response.status === 401) {
        redirect("/portal");
    }

    return (
        <div className={styles.home}>
            <HomeNavbar user={response.data as User} />
            <EventMenu />
            <NewsCarousel />
            <GameMenu />
            <ChatPanel />
        </div>
    )
}