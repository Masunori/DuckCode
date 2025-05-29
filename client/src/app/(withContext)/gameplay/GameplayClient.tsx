"use client";

import { useUser } from "@/app/components/contexts/UserContext";
import { Question } from "./gameplayUtils";
import { LAYOUTS } from "./layout/layoutUtils";

export default function GameplayClient({ question }: { question: Question }) {
    const { user } = useUser();

    return (
        LAYOUTS[user.userPreference.gameplayLayout].implementation(question)
    );
}