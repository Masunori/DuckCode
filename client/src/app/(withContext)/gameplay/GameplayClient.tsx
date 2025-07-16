"use client";

import { useUserStore } from"@/app/components/contexts/UserContext";
import { Question } from "./gameplayUtils";
import { LAYOUTS } from "./layout/layoutUtils";
import { useGameplayStore } from "./hooks/useGameplayStore";
import { useGameplayController } from "./hooks/useGameplayController";
import { useEffect } from "react";

export default function GameplayClient({ question }: { question: Question }) {
    const user = useUserStore(state => state.user);

    // load the question into the gameplay controller
    useEffect(() => {
        useGameplayStore.getState().setQuestion(question);
    }, [question]);

    // set the information mode for respective layouts
    const layout = user.userPreference.gameplayLayout;
    
    // set information mode based on layout
    useEffect(() => {
        useGameplayController.getState().setInformationMode(
            ["Default", "Inverted"].includes(layout)
                ? "testCases"
                : ["Two Tabs", "Two Tabs Inverted"].includes(layout)
                ? "question"
                : "-"
        );
    }, [layout]);

    return (
        LAYOUTS[layout].implementation
    );
}