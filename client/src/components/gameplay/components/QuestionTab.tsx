"use client";

import { Question } from "@/lib/gameplay/utils"
import styles from "../page.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import QuestionSwitcher from "./QuestionSwitcher";
import QuestionDisplay from "./QuestionDisplay";

type QuestionProps = {
    questions: Question[];
}

export default function QuestionTab({ questions }: QuestionProps) {
    const activeQuestionIndex = useBaseGameplayStore(state => state.activeQuestionIndex);
    const question = questions[activeQuestionIndex];

    return (
        <div className={styles.questionTab}>
            <QuestionSwitcher numQuestions={questions.length} />
            <QuestionDisplay question={question} />
        </div>
    )
}