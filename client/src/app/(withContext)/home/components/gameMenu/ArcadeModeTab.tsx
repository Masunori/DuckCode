"use client";

import DoubleThumbRangeInput from "@/components/inputs/DoubleThumbRangeInput";
import PaginationController from "@/components/inputs/PaginationController";
import { useUserStore } from "@/contexts/UserContext";
import { tryApiCallWithAuth } from "@/lib/apiClient/apiCallWithAuth";
import { getQuestionsInRange as getQnAPI } from "@/lib/apiClient/gameplay";
import { printd } from "@/lib/utils/debugUtils";
import { motion } from 'motion/react';
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { GAME_MODES, GameMenuTab } from "../../homeUtils";
import styles from "../../page.module.css";

type ArcadeModeTabProps = {
    setTab: Dispatch<SetStateAction<GameMenuTab>>;
}

function QuestionItem({ qid, title, difficulty }: { qid: string; title: string; difficulty: number }) {
    return <button className={styles.questionItem}>
        <p className={styles.questionId}>{qid}</p>
        <p className={styles.questionTitle}><b>{title}</b></p>
        <p className={styles.questionDifficulty}>{difficulty}</p>
    </button>
}

const PAGE_SIZE = 50;

type QuestionInfo = {
    qid: string;
    title: string;
    difficulty: number;
}

export default function ArcadeModeTab({ setTab }: ArcadeModeTabProps) {
    const router = useRouter();
    const user = useUserStore(state => state.user);

    const [view, setView] = useState<"gameMode" | "questions">("gameMode");
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo[]>([]);
    const [questionPage, setQuestionPage] = useState<number>(1);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionInfo | null>(null);

    // Handle closing the tab when clicking outside of it.
    const overlayRef = useRef<HTMLDivElement>(null);
    const arcadeModeTabRef = useRef<HTMLDivElement>(null);
    const questionListRefs = useRef<Map<string, HTMLLIElement>>(new Map());

    // Auto-scroll to selected question
    useEffect(() => {
        const questionList = questionListRefs.current;

        if (selectedQuestion && questionList.has(selectedQuestion.qid)) {
            const element = questionList.get(selectedQuestion.qid);
            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectedQuestion]);

    async function getQuestionsInRange(minDifficulty: number, maxDifficulty: number): Promise<void> {
        await tryApiCallWithAuth(() => getQnAPI(minDifficulty, maxDifficulty))
            .then(response => {
                printd("@/home/components/gameMenu/ArcadeModeTab", `Fetched ${response.data.length} questions in range ${minDifficulty}-${maxDifficulty}: ${JSON.stringify(response)}`);

                switch (response.status) {
                    case 200:
                        setQuestionInfo(response.data);
                        break;
                    default:
                        console.error(`Failed to fetch questions in range ${minDifficulty}-${maxDifficulty}: ${response.status}`);
                        setQuestionInfo([]);
                }
            });
    }

    const slice = useMemo(() =>
        questionInfo.slice((questionPage - 1) * PAGE_SIZE, questionPage * PAGE_SIZE)
        , [questionInfo, questionPage]);

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
    const [difficultyRange, setDifficultyRange] = useState<[number, number]>([Math.min(Math.max(user.rankPoint, 0), 5000), Math.min(Math.max(user.rankPoint, 0), 5000)]);

    const gameModeView = () => <>
        <motion.div
            className={`${styles.arcadeModeTab} ${styles.gameModeView}`}
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
                            defaultMinThumbValue={difficultyRange[0]}
                            defaultMaxThumbValue={difficultyRange[1]}
                            min={0}
                            max={5000}
                            step={25}
                            onChange={(lower, upper) => {
                                setDifficultyRange([lower, upper]);
                            }}
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
                        disabled={mode !== "classic"}
                        onClick={async () => {
                            if (mode === "classic") {
                                await getQuestionsInRange(difficultyRange[0], difficultyRange[1]);
                                setView("questions");
                            } else {
                                setQuestionInfo([]);
                                setView("questions");
                            }
                        }}
                    >{mode === "classic" ? "Select Mode" : "Not Available"}</button>
                </div>
            </motion.div>
        </motion.div>
    </>;

    const questionView = () => <motion.div
        className={`${styles.arcadeModeTab} ${styles.questionView}`}
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
                <h1>Questions</h1>
                <span></span>
            </header>
            {
                questionInfo.length === 0
                    ? <p>No questions found in the selected difficulty range.</p>
                    : <div className={styles.questionListWithPagination}>
                        <p>Showing {questionPage * PAGE_SIZE - PAGE_SIZE + 1} - {Math.min(questionPage * PAGE_SIZE, questionInfo.length || 0)} of {questionInfo.length || 0} questions</p>
                        <ul className={styles.questionList}>
                            {slice.map((qn) => (
                                <li
                                    key={qn.qid}
                                    ref={(el) => {
                                        if (el) {
                                            questionListRefs.current.set(qn.qid, el);
                                        } else {
                                            questionListRefs.current.delete(qn.qid);
                                        }
                                    }}
                                    className={qn.qid === selectedQuestion?.qid ? styles.selected : ""}
                                    onClick={() => { setSelectedQuestion(slice.find(currQn => currQn.qid === qn.qid) ?? null) }}
                                >
                                    <QuestionItem qid={qn.qid} title={qn.title} difficulty={qn.difficulty} />
                                </li>
                            ))}
                        </ul>
                        <PaginationController
                            pageNumber={questionPage}
                            onPageChange={(newPageNumber) => setQuestionPage(newPageNumber)}
                            maxPage={Math.ceil(questionInfo.length / PAGE_SIZE)}
                        />
                    </div>
            }
        </motion.div>
        <motion.div className={styles.arcadeModeDescriptionAndAction}>
            <div className={styles.arcadeModeDescription}>
                <p>SELECTED QUESTION: {selectedQuestion?.title ?? "None"}</p>
                <br></br>
                <p>DIFFICULTY: {selectedQuestion?.difficulty ?? "None"}</p>
            </div>
            <div className={styles.arcadeModeActions}>
                <button
                    className={styles.goBackButton}
                    onClick={() => setView("gameMode")}
                >Go Back</button>
                <button
                    className={styles.luckyButton}
                    onClick={async () => {
                        const randomPage = Math.floor(Math.random() * Math.ceil(questionInfo.length / PAGE_SIZE)) + 1;
                        setQuestionPage(randomPage);

                        const newSlice = questionInfo.slice((randomPage - 1) * PAGE_SIZE, randomPage * PAGE_SIZE);
                        const randomQuestion = newSlice[Math.floor(Math.random() * newSlice.length)];
                        setSelectedQuestion(randomQuestion);
                    }}
                >I'm feeling lucky</button>
                <button
                    className={styles.playButton}
                    onClick={async () => {
                        if (selectedQuestion) {
                            router.push(`/arcade?qid=${selectedQuestion.qid}`);
                        }
                    }}
                    disabled={!selectedQuestion}
                    style={{
                        cursor: selectedQuestion ? "pointer" : "not-allowed",
                    }}
                >Play</button>
            </div>
        </motion.div>
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
            {view === "questions" && questionView()}
        </>
    );
}