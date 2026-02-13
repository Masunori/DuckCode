"use client";

import { PLKeys, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useRef } from "react";
import { Question } from "@/lib/gameplay/utils";
import Chatbox from "@/components/multiplayer/components/Chatbox";
import MultiplayerNavbar from "@/components/multiplayer/components/MultiplayerNavbar";
import StrategyBoard from "@/components/multiplayer/components/StrategyBoard";
import { LAYOUTS } from "@/components/multiplayer/layout/layoutUtils";
import { ExecutionStatus, TestCaseResult } from "./multiplayerUtils";
import { useCodeEditorStore } from "./stores/codeEditorStores";
import { useCodeExecutionStore } from "./stores/codeExecutionStore";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";

type MultiplayerClientProps = {
    initialServerData: {
        questions: Question[];
        initialTime: number;
        programmingLanguage: PLKeys;
    }
}

export default function MultiplayerClient({ initialServerData }: MultiplayerClientProps) {
    // const user = useUserStore(state => state.user);
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const isAlreadyInitialized = useRef(false);

    // set up the entire gameplay
    if (!isAlreadyInitialized.current) {
        isAlreadyInitialized.current = true;

        useMultiplayerGameplayStore.getState().setActiveCodeView({ kind: "shared" });
        useMultiplayerGameplayStore.getState().setProgrammingLanguage(initialServerData.programmingLanguage as PLKeys);

        // for (const [userId, code] of Object.entries(initialServerData.codeByUser)) {
        //     useCodeEditorStore.getState().setCodeForUser(userId, code);
        // }

        useMultiplayerGameplayStore.getState().setCodeContent(new Array<string>(
            initialServerData.questions.length).fill(PROGRAMMING_LANGUAGES[initialServerData.programmingLanguage].codeSnippet)
        );

        for (const [userId, status] of Object.entries(initialServerData.executionStatusByUser)) {
            useCodeExecutionStore.getState().setExecutionStatus(userId, status as ExecutionStatus);
        }

        for (const userId of Object.keys(initialServerData.codeByUser)) {
            useCodeExecutionStore.getState().setTestCaseResults(userId, new Array<TestCaseResult>(initialServerData.question.publicTestCases.length));
            useCodeExecutionStore.getState().setOutput(userId, [{ type: "log", content: ">> Code results will be shown here..." }])
        }
    }

    return (
        <>
            <MultiplayerNavbar initialTime={initialServerData.initialTime} />
            <StrategyBoard />
            <Chatbox />
            {LAYOUTS[userPreference.gameplayLayout].implementation(initialServerData.questions)}
        </>
    );
}