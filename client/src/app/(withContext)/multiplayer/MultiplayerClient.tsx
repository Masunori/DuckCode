"use client";

import { PLKeys } from "@/components/settings/settingsUtils";
import { useUserStore } from "@/contexts/UserContext";
import { useRef } from "react";
import { Question } from "@/lib/gameplay/utils";
import Chatbox from "./components/Chatbox";
import MultiplayerNavbar from "./components/MultiplayerNavbar";
import StrategyBoard from "./components/StrategyBoard";
import { useGameplayController } from "./hooks/useGameplayController";
import { LAYOUTS } from "./layout/layoutUtils";
import { ExecutionStatus, TestCaseResult } from "./multiplayerUtils";
import { useCodeEditorStore } from "./stores/codeEditorStores";
import { useCodeExecutionStore } from "./stores/codeExecutionStore";

type MultiplayerClientProps = {
    initialServerData: {
        question: Question;
        initialTime: number;
        activeTab: string;
        codeByUser: {
            [userId: string]: string;
        };
        executionStatusByUser: {
            [userId: string]: string;
        };
        programmingLanguage: PLKeys;
        readOnlyTabs: string[];
    }
}

export default function MultiplayerClient({ initialServerData }: MultiplayerClientProps) {
    const user = useUserStore(state => state.user);
    const isAlreadyInitialized = useRef(false);

    // set up the entire gameplay
    if (!isAlreadyInitialized.current) {
        isAlreadyInitialized.current = true;

        useGameplayController.getState().setActiveTab(initialServerData.activeTab);
        useGameplayController.getState().setReadOnlyTabs(initialServerData.readOnlyTabs);
        useCodeEditorStore.getState().setProgrammingLanguage(initialServerData.programmingLanguage as PLKeys);

        for (const [userId, code] of Object.entries(initialServerData.codeByUser)) {
            useCodeEditorStore.getState().setCodeForUser(userId, code);
        }

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
            {LAYOUTS[user.userPreference.gameplayLayout].implementation(initialServerData.question)}
        </>
    );
}