"use client";

import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Question, TestCaseResult } from "@/lib/gameplay/utils";
import { useEffect } from "react";
import InstructionOverlay from "./InstructionOverlay";
import { useGettingStartedInstruction } from "@/contexts/GettingStartedInstructionContext";

const question: Question = {
    qid: "getting-started",
    title: "Getting Started",
    difficulty: 0,
    description: [
        "Welcome to DuckCode!",
        "Your first challenge is to print 'Hello, World!' to the output. This is a traditional first step in learning any programming language, and it's a great way to get familiar with our code editor and testing environment.",
    ],
    input: ["There is no input for this challenge."],
    output: ["Your program should output the following line exactly: Hello, World!"],
    examples: [
        {
            input: [""],
            output: ["Hello, World!"],
            explanation: "Since there is no input, your program should simply print 'Hello, World!' to the output."
        }
    ],
    constraints: ["There are no specific constraints for this challenge."],
    publicTestCases: [
        {
            tid: 1,
            input: "<Nothing 1>",
            expectedOutput: "Hello, World!",
        },
        {
            tid: 2,
            input: "<Nothing 2>",
            expectedOutput: "Hello, World!",
        }
    ]
}

export default function Page() {    
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const ctx = useGettingStartedInstruction();
    if (!ctx) {
        return;
    }

    const { 
        getTargetRect, 
        getInstruction, 
        getMessagePosition, 
        advanceInstruction, 
        regressInstruction, 
        skip, 
        isEndOfInstructions 
    } = ctx;

    const setQuestions = useBaseGameplayStore(state => state.setQuestions);
    const setTestCaseResults = useBaseGameplayStore(state => state.setTestCaseResults);
    const setCodeContent = useBaseGameplayStore(state => state.setCodeContent);

    const initialTestCaseResults: TestCaseResult[][] = Array(1).fill([]);

    useEffect(() => {
        setQuestions([question]);
        setTestCaseResults(initialTestCaseResults);

        const initialCodeContent: string[] = Array(1).fill("");
        setCodeContent(initialCodeContent);
    }, []);

    // useEffect(() => {
    //     alert(getInstruction());
    // }, [getInstruction]);

    return <>
        {LAYOUTS["Default"].implementation([question])}
        {
            isEndOfInstructions ? null : <InstructionOverlay 
                message={getInstruction()}
                target={getTargetRect()}
                messagePosition={getMessagePosition()}
                onRegress={regressInstruction}
                onAdvance={advanceInstruction}
                onSkip={skip}
            />
        }
    </>
}