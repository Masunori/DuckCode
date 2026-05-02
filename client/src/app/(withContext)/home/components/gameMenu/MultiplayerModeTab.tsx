"use client";

import { useUserStore } from "@/contexts/UserContext";
import { tryApiCallWithAuth } from "@/lib/apiClient/apiCallWithAuth";
import { printd } from "@/lib/utils/debugUtils";
import { motion } from 'motion/react';
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { GAME_MODES, GameMenuTab } from "../../homeUtils";
import styles from "../../page.module.css";
import animationStyles from "@/components/styles/animations.module.css";
import Spinner from "@/components/loading/Spinner";
import DropdownInput from "@/components/inputs/DropdownInput";

type MultiplayerModeTabProps = {
    setTab: Dispatch<SetStateAction<GameMenuTab>>;
}

const PAGE_SIZE = 50;

type QuestionInfo = {
    qid: string;
    title: string;
    difficulty: number;
}

export default function MultiplayerModeTab({ setTab }: MultiplayerModeTabProps) {
    const router = useRouter();
    const user = useUserStore(state => state.user);

    const [view, setView] = useState<"gameMode" | "queue">("gameMode");
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionInfo | null>(null);

    // Handle closing the tab when clicking outside of it.
    const overlayRef = useRef<HTMLDivElement>(null);
    const multiplayerModeTabRef = useRef<HTMLDivElement>(null);
    const questionListRefs = useRef<Map<string, HTMLLIElement>>(new Map());

    // Auto-scroll to selected question
    useEffect(() => {
        const questionList = questionListRefs.current;

        if (selectedQuestion && questionList.has(selectedQuestion.qid)) {
            const element = questionList.get(selectedQuestion.qid);
            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedQuestion]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current
                && multiplayerModeTabRef.current
                && overlayRef.current.contains(event.target as Node)
                && !multiplayerModeTabRef.current.contains(event.target as Node)
            ) {
                setTab("");
            }
        };

        if (view === "gameMode") {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    });

    const [mode, setMode] = useState<string>("classic");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const gameModeView = () => <>
        <motion.div
            className={`${styles.arcadeModeTab} ${styles.gameModeView}`}
            ref={multiplayerModeTabRef}
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
                        <DropdownInput 
                            options={["1v1", "3v3"]}
                            inputId="ranked-format"
                            defaultOption="1v1"
                            dropdownName="Ranked Format"
                            handleOptionChange={() => {}}
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
                    <p>{GAME_MODES[mode].description}</p>
                </div>
                <div className={styles.arcadeModeActions}>
                    <button
                        className={styles.selectModeButton}
                        disabled={isLoading || mode !== "classic"}
                        onClick={async () => {
                            if (mode === "classic") {
                                setIsLoading(true);
                                // await getQuestionsInRange(difficultyRange[0], difficultyRange[1]);
                                setIsLoading(false);
                                setView("queue");
                            } else {
                                setView("queue");
                            }
                        }}
                    >
                        {
                            isLoading
                            ? <Spinner />
                            : mode === "classic" 
                                ? "Select Mode" 
                                : "Not Available"
                        }
                    </button>
                </div>
            </motion.div>
        </motion.div>
    </>;

    const queueView = () => <motion.div
        className={`${styles.matchmakingTab} ${animationStyles.illuminatingBorder}`}
        ref={multiplayerModeTabRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
    >
        <div className={styles.queueView}>
            <h3>Expected Wait Time: 2-5 days</h3>
            <button
                className={styles.cancelQueueButton}
                onClick={() => setView("gameMode")}
            >
                Cancel Matchmaking
            </button>
        </div>
    </motion.div>;

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
            {view === "gameMode" && gameModeView()}
            {view === "queue" && queueView()}
        </>
    );
}