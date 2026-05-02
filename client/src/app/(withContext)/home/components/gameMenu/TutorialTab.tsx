"use client";

import DoubleThumbRangeInput from "@/components/inputs/DoubleThumbRangeInput";
import PaginationController from "@/components/inputs/PaginationController";
import { useUserStore } from "@/contexts/UserContext";
import { tryApiCallWithAuth } from "@/lib/apiClient/apiCallWithAuth";
import { getQuestionsInRange as getQnAPI } from "@/lib/apiClient/gameplay";
import { printd } from "@/lib/utils/debugUtils";
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { GAME_MODES, GameMenuTab } from "../../homeUtils";
import styles from "../../page.module.css";
import Spinner from "@/components/loading/Spinner";
import { LessonInfo, TopicInfo, tutorialTopics } from "@/app/(withContext)/(tutorial)/lessons";

type TutorialTabProps = {
    setTab: Dispatch<SetStateAction<GameMenuTab>>;
}

type TopicProps = {
    topicInfo: TopicInfo;
    selectedLessonId?: string;
    onClickLesson: (lessonInfo: LessonInfo) => void;
}

function Topic({ topicInfo, selectedLessonId, onClickLesson }: TopicProps) {
    const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

    return (
        <div className={styles.tutorialTopic}>
            <h3 onClick={() => setIsOpenDropdown(prev => !prev)} className={selectedLessonId && topicInfo.lessons.some(l => l.id === selectedLessonId) ? styles.selected : undefined}>
                {topicInfo.title}
            </h3>
            <AnimatePresence>
                {isOpenDropdown && <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                >
                    {topicInfo.lessons.map(lesson => (
                        <li
                            key={lesson.id}
                            onClick={() => onClickLesson(lesson)}
                            className={selectedLessonId === lesson.id ? styles.selected : undefined}
                        >
                            <p className={styles.title}>{lesson.title}</p>
                            <p className={styles.exp}>{lesson.exp}</p>
                        </li>
                    ))}
                </motion.ul>}
            </AnimatePresence>
        </div>
    )
}

export default function TutorialTab({ setTab }: TutorialTabProps) {
    const router = useRouter();
    const user = useUserStore(state => state.user);

    const [view, setView] = useState<"gameMode" | "questions">("gameMode");

    // Handle closing the tab when clicking outside of it.
    const overlayRef = useRef<HTMLDivElement>(null);
    const arcadeModeTabRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        printd("@/home/components/gameMenu/ArcadeModeTab", "View:", view);
    }, [view]);


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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lesson, setLesson] = useState<LessonInfo | null>(null);

    const tutorialModeView = () => <>
        <motion.div
            className={`${styles.tutorialModeTab}`}
            ref={arcadeModeTabRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className={styles.verticalBar}></div>
            <motion.div className={styles.tutorialModeOptions}>
                <header>
                    <span></span>
                    <h1>Lessons</h1>
                    <span></span>
                </header>
                <div className={styles.container}>
                    {tutorialTopics.map(topic => <Topic key={topic.id} topicInfo={topic} selectedLessonId={lesson?.id} onClickLesson={setLesson} />)}
                </div>
            </motion.div>
            <motion.div className={styles.arcadeModeDescriptionAndAction}>
                <div className={styles.arcadeModeDescription}>
                    <p><b>SELECTED LESSON</b></p>
                    <br />
                    <p>{lesson?.title ?? "None"}</p>
                    <br /><br />
                    <p><b>TOPIC</b></p>
                    <br />
                    <p>{(lesson && tutorialTopics.find(t => t.lessons.some(l => l.id === lesson.id)))?.title ?? "None"}</p>
                    <br /><br />
                    <p><b>DESCRIPTION</b></p>
                    <br />
                    <p>{lesson?.description ?? "No lesson selected. Please select a lesson to see its description."}</p>
                </div>
                <div className={styles.arcadeModeActions}>
                    <button
                        className={styles.selectModeButton}
                        disabled={!lesson}
                        onClick={() => {
                            if (lesson) {
                                setIsLoading(true);
                                router.push(lesson.route);
                                setIsLoading(false);
                            }
                        }}
                    >
                        {
                            isLoading
                            ? <Spinner />
                            : "Select Lesson"
                        }
                    </button>
                </div>
            </motion.div>
        </motion.div>
    </>;

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
            {tutorialModeView()}
        </>
    );
}