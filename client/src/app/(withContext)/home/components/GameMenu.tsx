"use client";

import { MouseEventHandler, useState } from "react";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import ArcadeModeTab from "./gameMenu/ArcadeModeTab";
import { GameMenuTab } from "../homeUtils";
import { motion, AnimatePresence } from "motion/react";
import MultiplayerModeTab from "./gameMenu/MultiplayerModeTab";

type StylizedGameMenuButtonProps = {
    buttonName: string;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    buttonDescription: string;
    disabled?: boolean;
}

function StylizedGameMenuButton({ buttonName, onClick, buttonDescription, disabled }: StylizedGameMenuButtonProps) {
    return (
        <div className={styles.stylizedGameMenuButton}>
            <div className={styles.stylizedGameMenuButtonDescription}>
                {buttonDescription}
            </div>
            <button 
                onClick={onClick} 
                disabled={disabled}
            >{buttonName}</button>
            <div className={styles.stylizedGameMenuButtonOverlay}>
                
            </div>
        </div>
    )
}

export default function GameMenu() {
    const router = useRouter();

    const [tab, setTab] = useState<GameMenuTab>("");

    return (
        <div className={styles.gameMenu}>
            <StylizedGameMenuButton 
                buttonName="Multiplayer" 
                onClick={() => setTab("Multiplayer")} 
                buttonDescription="Code with or against other players, either casually or competitive." 
            />
            <StylizedGameMenuButton 
                buttonName="Arcade" 
                onClick={() => setTab("Arcade")} 
                buttonDescription="Code by yourself, at your own pace. Most Multiplayer game modes have an Arcade version." 
            />
            <StylizedGameMenuButton 
                buttonName="Playground" 
                onClick={() => router.push("/playground")} 
                buttonDescription="DuckCode's sandbox code editor that you can fiddle with." 
            />
            <StylizedGameMenuButton 
                buttonName="Tutorial" 
                onClick={undefined} 
                disabled={true}
                buttonDescription="Beginners or seasoned programmers, there is something for you here..." 
            />
            <StylizedGameMenuButton 
                buttonName="Join/Host a Match" 
                onClick={undefined} 
                disabled={true}
                buttonDescription="Create custom games and play with friends." 
            />

            <AnimatePresence>
                {tab === "Arcade" && (
                    <motion.div>
                        <ArcadeModeTab setTab={setTab} />
                    </motion.div>
                )}
                {tab === "Multiplayer" && (
                    <motion.div>
                        <MultiplayerModeTab setTab={setTab} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}