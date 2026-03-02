"use client";

import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Question, TestCaseResult } from "@/lib/gameplay/utils";
import { printd } from "@/lib/utils/debugUtils";
import { useEffect } from "react";

type GameplayClientProps = {
    initialServerData: {
        questions: Question[],
        initialTime: number
    }
}

export default function ArcadeClient({ initialServerData }: GameplayClientProps) {
    printd("@/app/(withContext)/arcade/ArcadeClient", "Rendering ArcadeClient with initialServerData:", initialServerData);

    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const setQuestions = useBaseGameplayStore(state => state.setQuestions);
    const setTestCaseResults = useBaseGameplayStore(state => state.setTestCaseResults);
    const setCodeContent = useBaseGameplayStore(state => state.setCodeContent);
    const codeContent = useBaseGameplayStore(state => state.codeContent);

    const initialTestCaseResults: TestCaseResult[][] = Array(initialServerData.questions.length).fill([]);
    
    useEffect(() => {
        setQuestions(initialServerData.questions);
        setTestCaseResults(initialTestCaseResults);

        if (codeContent.length === 0) {
            const initialCodeContent: string[] = Array(initialServerData.questions.length).fill(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);
            setCodeContent(initialCodeContent);
        }
    }, [initialServerData.questions, setQuestions, setTestCaseResults, setCodeContent, initialTestCaseResults]);

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