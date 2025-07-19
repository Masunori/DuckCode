"use client";

import { useUserStore } from"@/app/components/contexts/UserContext";
import { Question } from "./gameplayUtils";
import { LAYOUTS } from "./layout/layoutUtils";
import { useGameplayController } from "./hooks/useGameplayController";
import { useEffect } from "react";

type GameplayClientProps = {
    initialServerData: {
        question: Question,
        initialTime: number
    }
}

export default function GameplayClient({ initialServerData }: GameplayClientProps) {
    const user = useUserStore(state => state.user);

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
        LAYOUTS[layout].implementation(initialServerData.question)
    );
}