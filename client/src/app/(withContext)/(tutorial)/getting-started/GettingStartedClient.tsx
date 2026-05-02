"use client";

import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";
import { Question, TestCaseResult } from "@/lib/gameplay/utils";
import { useEffect } from "react";
import InstructionOverlay from "./InstructionOverlay";
import { useGettingStartedInstruction } from "@/contexts/GettingStartedInstructionContext";
import { motion } from "motion/react"; 


export default function GettingStartedClient({ question }: { question: Question }) {    
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


    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
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
    </motion.div>
}