"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import { GAME_MODES, GameMenuTab } from "../../homeUtils";
import { useUserStore } from "@/app/components/contexts/UserContext";
import { motion } from 'motion/react';
import DoubleThumbRangeInput from "@/app/components/inputs/DoubleThumbRangeInput";
import { useRouter } from "next/navigation";

type ArcadeModeTabProps = {
    setTab: Dispatch<SetStateAction<GameMenuTab>>;
}

export default function ArcadeModeTab({ setTab }: ArcadeModeTabProps) {
    const router = useRouter();
    const user = useUserStore(state => state.user);

    // Handle closing the tab when clicking outside of it.
    const overlayRef = useRef<HTMLDivElement>(null);
    const arcadeModeTabRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current 
                && arcadeModeTabRef.current
                && overlayRef.current.contains(event.target as Node)
                && !arcadeModeTabRef.current.contains(event.target as Node)
            ) {
                setTab("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const [mode, setMode] = useState<string>("classic");

    return (
        <>
            <motion.div 
                className={styles.gameMenuTabOverlay} 
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
            </motion.div>
            <>
                <motion.div
                    className={styles.arcadeModeTab}
                    ref={arcadeModeTabRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className={styles.verticalBar}></div>
                    <motion.div className={styles.arcadeModeOptions}>
                        <header>
                            <span></span>
                            <h1>Options</h1>
                            <span></span>
                        </header>
                        <div className={styles.container}>
                            <div className={styles.arcadeModeOption}>
                                <DoubleThumbRangeInput
                                    inputId="difficulty-slider"
                                    inputName="Difficulty"
                                    defaultMinThumbValue={Math.min(Math.max(user.rankPoints, 0), 5000)}
                                    defaultMaxThumbValue={Math.min(Math.max(user.rankPoints, 0), 5000)}
                                    min={0}
                                    max={5000}
                                    step={25}
                                    onChange={(lower, upper) => { console.log(lower + " " + upper) }}
                                />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className={styles.arcadeGameModes}>
                        <header>
                            <span></span>
                            <h1>Game Modes</h1>
                            <span></span>
                        </header>
                        <div className={styles.container}>
                            <ul>
                                {Object.entries(GAME_MODES).map(([name, desc]) => (
                                    <li
                                        key={name}
                                        onClick={() => setMode(name)}
                                        className={mode === name ? styles.selected : ""}
                                    >
                                        <h2>{desc.name}</h2>
                                        <p>{desc.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                    <motion.div className={styles.arcadeModeDescriptionAndAction}>
                        <div className={styles.arcadeModeDescription}>
                            <p>SELECTED MODE: {GAME_MODES[mode].name}</p>
                            <br></br>
                            <p>DESCRIPTION: {GAME_MODES[mode].description}</p>
                        </div>
                        <div className={styles.arcadeModeActions}>
                            <button
                                onClick={() => {
                                    if (mode === "classic") {
                                        router.push("/gameplay");
                                    }
                                }}
                            >Start Match</button>
                        </div>
                    </motion.div>
                </motion.div>
            </>
        </>
    );
}