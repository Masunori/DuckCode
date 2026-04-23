"use client";

import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useTimerStore } from "@/hooks/useTimerStore";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Question, TestCaseResult } from "@/lib/gameplay/utils";
import { printd } from "@/lib/utils/debugUtils";
import { useEffect, useRef } from "react";

type GameplayClientProps = {
    initialServerData: {
        questions: Question[];
    }
}

export default function ArcadeClient({ initialServerData }: GameplayClientProps) {
    printd("@/app/(withContext)/arcade/ArcadeClient", "Rendering ArcadeClient with initialServerData:", initialServerData);

    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const questions = useBaseGameplayStore(state => state.questions);

    const setQuestions = useBaseGameplayStore(state => state.setQuestions);
    const setTestCaseResults = useBaseGameplayStore(state => state.setTestCaseResults);
    const setCodeContent = useBaseGameplayStore(state => state.setCodeContent);
    const codeContent = useBaseGameplayStore(state => state.codeContent);

    const initialTestCaseResults: TestCaseResult[][] = Array(initialServerData.questions.length).fill([]);
    
    const startTimer = useTimerStore(state => state.start);
    const pauseTimer = useTimerStore(state => state.pause);

    useEffect(() => {
        printd("@/app/(withContext)/arcade/ArcadeClient", `${questions.length}`);

        // - questions.length == 0 means it is a new game
        // - questions.length > 0 means the user is just reloading or coming back to the page, 
        //   in which case we should preserve the timer state (which is handled in the TimerStore)
        if (questions.length == 0) {
            startTimer();
        }

        setQuestions(initialServerData.questions);
        setTestCaseResults(initialTestCaseResults);

        if (codeContent.length === 0) {
            const initialCodeContent: string[] = Array(initialServerData.questions.length).fill(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
            setCodeContent(initialCodeContent);
        }
    }, [startTimer, pauseTimer, initialServerData.questions, setQuestions, setTestCaseResults, setCodeContent, initialTestCaseResults]);


    // set the information mode for respective layouts
    const layout = userPreference.gameplayLayout;

    useEffect(() => {
        useBaseGameplayStore.getState().setInformationMode(
            ["Default", "Inverted"].includes(layout)
                ? "testCases"
                : ["Two Tabs", "Two Tabs Inverted"].includes(layout)
                    ? "question"
                    : "-"
        )
    }, [layout]);

    return (
        LAYOUTS[layout].implementation(initialServerData.questions)
    );
}