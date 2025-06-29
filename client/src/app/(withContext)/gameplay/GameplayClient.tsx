"use client";

import { useUserStore } from"@/app/components/contexts/UserContext";
import { Question } from "./gameplayUtils";
import { LAYOUTS } from "./layout/layoutUtils";

export default function GameplayClient({ question }: { question: Question }) {
    const user = useUserStore(state => state.user);

    return (
        LAYOUTS[user.userPreference.gameplayLayout].implementation(question)
    );
}