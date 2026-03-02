"use client";

import styles from "../../gameplay/page.module.css";
import { useShallow } from "zustand/shallow";
import { useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";

export default function QuestionSwitcher({ numQuestions }: { numQuestions: number }) {
    const [activeQuestionIndex, setActiveQuestionIndex] = useMultiplayerGameplayStore(
        useShallow(state => [
            state.activeQuestionIndex,
            state.setActiveQuestionIndex
        ])
    );

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const val = Math.min(Math.max(Number(e.target.value), 1), numQuestions);
    //     setActiveQuestionIndex(val - 1);
    // }

    return (
        <div className={styles.questionSwitcher}>
            <button 
                disabled={activeQuestionIndex === 0}
                style={{
                    pointerEvents: activeQuestionIndex === 0 ? "none" : "auto"
                }}
                onClick={() => setActiveQuestionIndex(i => Math.max(i - 1, 0))}
            >Prev</button>
            <div>
                Question <span>{activeQuestionIndex + 1}</span> of {numQuestions}
            </div>
            <button 
                disabled={activeQuestionIndex === numQuestions - 1}
                style={{
                    pointerEvents: activeQuestionIndex === numQuestions - 1 ? "none" : "auto"
                }}
                onClick={() => setActiveQuestionIndex(i => Math.min(i + 1, numQuestions - 1))}
            >Next</button>
        </div>
    )
}