"use client";

import { MouseEventHandler } from "react";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";

type StylizedGameMenuButtonProps = {
    buttonName: string;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    buttonDescription: string;
}

function StylizedGameMenuButton({ buttonName, onClick, buttonDescription }: StylizedGameMenuButtonProps) {
    return (
        <div className={styles.stylizedGameMenuButton}>
            <div className={styles.stylizedGameMenuButtonDescription}>
                {buttonDescription}
            </div>
            <button onClick={onClick}>{buttonName}</button>
            <div className={styles.stylizedGameMenuButtonOverlay}>
                
            </div>
        </div>
    )
}

export default function GameMenu() {
    const router = useRouter();

    return (
        <div className={styles.gameMenu}>
            <StylizedGameMenuButton buttonName="Multiplayer" onClick={undefined} buttonDescription="Code with and against other players, either casually or competitive." />
            <StylizedGameMenuButton buttonName="Arcade" onClick={undefined} buttonDescription="Code by yourself, at your own pace. Most Multiplayer game modes have an Arcade version." />
            <StylizedGameMenuButton buttonName="Playground" onClick={() => router.push("/gameplay")} buttonDescription="DuckCode's sandbox code editor that you can fiddle with." />
            <StylizedGameMenuButton buttonName="Tutorial" onClick={undefined} buttonDescription="Beginners or seasoned programmers, there is something for you here..." />
            <StylizedGameMenuButton buttonName="Inventory" onClick={undefined} buttonDescription="Every item you have earned is stored here!" />
            <StylizedGameMenuButton buttonName="Clan" onClick={undefined} buttonDescription="Meet programmers with the same interest." />
        </div>
    )
}