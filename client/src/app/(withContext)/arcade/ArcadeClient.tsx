"use client";

import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useUserStore } from "@/contexts/UserContext";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Question, TestCaseResult } from "@/lib/gameplay/utils";
import { printd } from "@/lib/utils/debugUtils";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

type GameplayClientProps = {
    initialServerData: {
        questions: Question[],
        initialTime: number
    }
}

export default function ArcadeClient({ initialServerData }: GameplayClientProps) {
    printd("@/app/(withContext)/arcade/ArcadeClient", "Rendering ArcadeClient with initialServerData:", initialServerData);

    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const [
        setQuestions, setTestCaseResults, setCodeContent
    ] = useBaseGameplayStore(
        useShallow(
            state => [
                state.setQuestions,
                state.setTestCaseResults,
                state.setCodeContent
            ]
        )
    )

    const initialTestCaseResults: TestCaseResult[][] = Array(initialServerData.questions.length).fill([]);
    const initialCodeContent: string[] = Array(initialServerData.questions.length).fill(PROGRAMMING_LANGUAGES[userPreference.language].codeSnippet);

    useEffect(() => {
        setQuestions(initialServerData.questions);
        setTestCaseResults(initialTestCaseResults);
        setCodeContent(initialCodeContent);
    }, [initialServerData.questions, setQuestions, setTestCaseResults, setCodeContent]);

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