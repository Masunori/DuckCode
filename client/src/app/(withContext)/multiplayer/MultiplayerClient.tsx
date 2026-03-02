"use client";

import { PLKeys, PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useRef } from "react";
import { Question } from "@/lib/gameplay/utils";
import Chatbox from "@/components/multiplayer/components/Chatbox";
import MultiplayerNavbar from "@/components/multiplayer/components/MultiplayerNavbar";
import StrategyBoard from "@/components/multiplayer/components/StrategyBoard";
import { LAYOUTS } from "@/components/multiplayer/layout/layoutUtils";
import { ExecutionStatus, TestCaseResult } from "./multiplayerUtils";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { selectCodeOutputSetterForUser, selectExecutionStatusSetterForUser, selectTestCaseResultsSetterForUser, useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";
import { printd } from "@/lib/utils/debugUtils";

type MultiplayerClientProps = {
    initialServerData: {
        questions: Question[];
        initialTime: number;
        programmingLanguage: PLKeys;
        teammatesIds: string[];
    }
}

export default function MultiplayerClient({ initialServerData }: MultiplayerClientProps) {
    // const user = useUserStore(state => state.user);
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const isAlreadyInitialized = useRef(false);

    printd("@/app/(withContext)/multiplayer/MultiplayerClient", "Rendering MultiplayerClient with initialServerData:", initialServerData);

    // set up the entire gameplay
    if (!isAlreadyInitialized.current) {
        isAlreadyInitialized.current = true;

        useMultiplayerGameplayStore.getState().setActiveCodeView({ kind: "shared" });
        useMultiplayerGameplayStore.getState().setProgrammingLanguage(initialServerData.programmingLanguage as PLKeys);

        useMultiplayerGameplayStore.getState().setCodeContent(new Array<string>(
            initialServerData.questions.length).fill(PROGRAMMING_LANGUAGES[initialServerData.programmingLanguage].codeSnippet)
        );

        for (const userId of initialServerData.teammatesIds) {
            const setter = selectExecutionStatusSetterForUser(useMultiplayerGameplayStore.getState());
            setter(userId, "idle");
        }

        for (const userId of initialServerData.teammatesIds) {
            const testCaseResultsSetter = selectTestCaseResultsSetterForUser(useMultiplayerGameplayStore.getState());
            const outputSetter = selectCodeOutputSetterForUser(useMultiplayerGameplayStore.getState());

            for (let i = 0; i < initialServerData.questions.length; i++) {
                testCaseResultsSetter(userId, i, new Array<TestCaseResult>(initialServerData.questions[i].publicTestCases.length));
            }

            outputSetter(userId, [{ type: "log", content: ">> Code results will be shown here..." }]);
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