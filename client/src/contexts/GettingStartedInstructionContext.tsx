"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type GettingStartedInstructionContextType = {
    /** The bounding rectangle dimension of the highlighted component. */
    currentTarget?: string;
    /** Sets the current target element. */
    setCurrentTarget: (target: string | undefined) => void;
    /** Moves to the next instruction. */
    advanceInstruction: () => void;
    /** Moves to the previous instruction. */
    regressInstruction: () => void;
    /** Whether the user has reached the end of the instructions. */
    isEndOfInstructions: boolean;
    /** Skips to the end of the instructions. */
    skip: () => void;
    /** (For a component) to register its bounding rectangle. */
    registerTargetRect: (target: string, rect: DOMRect) => void;
    /** Gets the current instruction. */
    getInstruction: () => ReactNode;
    /** Gets the bounding rectangle of the current target. */
    getTargetRect: () => DOMRect | undefined;
    /** Gets the message box position of the current instruction. */
    getMessagePosition: () => { top: number; left: number, width: number, height: number };
}

type Instruction = {
    message: ReactNode;
    target?: string;
    messagePosition?: { top: number; left: number, width: number, height: number };
}

const instructions: Instruction[] = [
    { 
        message: <p>Welcome to DuckCode! Let's get you started with a quick tutorial.</p>,
    },
    { 
        message: (
            <p>
                This is the question panel, where you can read the problem statement and understand the requirements of the challenge.
            </p>
        ), 
        target: "question-display",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>This is the title of the question.</p>, 
        target: "question-title",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>Each question has a difficulty level, estimated by how players of different skill levels perform on it.</p>, 
        target: "question-difficulty",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>The description provides a detailed explanation of the problem and its requirements.</p>, 
        target: "question-description",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>Inputs to the question will follow a format described in this section.</p>, 
        target: "question-input",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>Your program should read the aforementioned inputs and produce outputs in the format described in this section.</p>, 
        target: "question-output",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>This section shows you how a sample input and expected output look, with some explanations if any.</p>, 
        target: "question-examples",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <p>The constraints section outlines any limitations or special conditions you need to consider while solving the problem.</p>, 
        target: "question-constraints",
        messagePosition: { top: 0.5, left: 0.45, width: 0.5, height: 0.3 },
    },
    { 
        message: <>
            <p>This is the code editor.</p>
            <ul>
                <li>Click on the editor, or press <kbd>I</kbd>, to start editing your code. While editing, other keyboard shortcuts are disabled until you stop editing.</li>
                <li>Click outside the editor, or press <kbd>Esc</kbd>, to stop editing.</li>
            </ul>
            <p>For this "Getting Started" challenge, copy <code>console.log("Hello, world!");</code> and paste it into the editor!</p>
        </>, 
        target: "code-editor",
    },
    { 
        message: <p>This is the area that you can see how your code will behave.</p>, 
        target: "test-cases",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>These buttons are how you interact with the code.</p>, 
        target: "code-handler-buttons",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <ul>
                <li>If this button says "Switch to Output Mode", click on it, or press <kbd>T</kbd> to switch to <b>output mode</b>.</li>
                <li>If the button says "Switch to Test Cases Mode", leave it there.</li>
            </ul>
        </>, 
        target: "toggle-button",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>This dark area shows the output of your code when you run it.</p>, 
        target: "code-results",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <p>In <b>output mode</b>, pressing this button will run the code. Try it!</p>
            <p>Alternatively, you can press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run the code. This will always run the code in output mode.</p>
            <p>After running the code, you would see a popup above.</p>
            <ul>
                <li>Click on the blue button, or press <kbd>Enter</kbd>, to confirm.</li>
                <li>Click on the gray button (if exists), or press <kbd>Escape</kbd>, to cancel.</li>
            </ul>
        </>, 
        target: "run-button",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>If you have filled in the code, this part would show "Hello, world!", which is the result of the code.</p>, 
        target: "code-results",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: 
            <ul>
                <li>If this button says "Switch to Test Cases Mode", click on it, or press <kbd>T</kbd> to switch to <b>test case mode</b>.</li>
                <li>If the button says "Switch to Output Mode", leave it there.</li>
            </ul>, 
        target: "toggle-button",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <p>Now, this area shows a list of test cases.</p>
            <p>A test case is a set of inputs, execution conditions, and expected results used to verify that a piece of code behaves as expected.</p>
            <p>What you see here are called <b>public test cases</b>, whose inputs and expected outputs are known to you.</p>
        </>,
        target: "code-results",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>You can select which test case you want to view by clicking on the respective option.</p>,
        target: "test-case-selector",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>After selection, the test case information will be displayed here.</p>,
        target: "test-case-results",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>As mentioned, each test case contains an input,</p>,
        target: "test-case-input",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>and an expected output.</p>,
        target: "test-case-expected",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <p>In <b>test case mode</b>, pressing this button will run the code against all test cases. Try it!</p>
            <p>Alternatively, you can press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> to run the code. This will always run the code in test cases mode.</p>
            <p>After running the code against all test cases, you would also see a popup above.</p>
            <ul>
                <li>Click on the blue button, or press <kbd>Enter</kbd>, to confirm.</li>
                <li>Click on the gray button (if exists), or press <kbd>Escape</kbd>, to cancel.</li>
            </ul>
        </>, 
        target: "run-button",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <p>Public test cases that you <b>pass</b> will be highlighted in green and with a tick.</p>
            <p>Public test cases that you <b>fail</b> will be highlighted in red and with a cross.</p>
        </>,
        target: "test-case-selector",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>If you fail a test case, this area will show what your code actually returns by running that test case's input.</p>,
        target: "test-case-actual",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>And this section will show you additional information from the test case execution. It might be your code fails to run, or it runs but returns a wrong result, or any other reason.</p>,
        target: "test-case-message",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <>
            <p>Once you feel confident, you can submit your solution! Click on this button, or press <kbd>S</kbd>.</p>
            <p>When submitted, your code will be run against both the given public test cases and a second set of test cases called <b>private test cases</b>, whose inputs and expected outputs are not shown to you.</p>
            <p>To pass the challenge, you need to pass all test cases, including both public and private ones.</p>
            <p>In the given code, the "w" should be "W". Now, fix the code and complete the challenge!</p>
        </>, 
        target: "submit-button",
        messagePosition: { top: 0.2, left: 0.0, width: 1, height: 0.5 },
    },
    { 
        message: <p>Good luck, and have fun coding!</p>,
    }
];

const GettingStartedInstructionContext = createContext<GettingStartedInstructionContextType | null>(null);

export function GettingStartedInstructionProvider({ children }: { children: React.ReactNode }) {
    const [currentTarget, setCurrentTarget] = useState<string | undefined>(undefined);
    const [currentInstructionIndex, setCurrentInstructionIndex] = useState<number>(0);
    const [isEndOfInstructions, setIsEndOfInstructions] = useState<boolean>(false);
    const [targetRectRegistry, setTargetRectRegistry] = useState<Record<string, DOMRect>>({
        "popup": new DOMRect(0.25 * window.innerWidth, 0, 0.5 * window.innerWidth, 138.4)
    });

    const registerTargetRect = (target: string, rect: DOMRect) => {
        setTargetRectRegistry((prev) => ({ ...prev, [target]: rect }));
    }

    const getInstruction: () => ReactNode = () => {
        return instructions[currentInstructionIndex].message;
    }

    const getTargetRect: () => DOMRect | undefined = () => {
        const targetName = instructions[currentInstructionIndex].target;
        if (targetName) {
            return targetRectRegistry[targetName] ?? undefined;
        }
        return undefined;
    }

    const getMessagePosition = () => {
        const instruction = instructions[currentInstructionIndex];
        if (instruction.messagePosition) {
            return instruction.messagePosition;
        }
        return { top: 0.75, left: 0, width: 1, height: 0.25 };
    }

    const advanceInstruction = () => {
        setCurrentInstructionIndex((prev) => {
            const newIndex = Math.min(prev + 1, instructions.length - 1);
            setIsEndOfInstructions(newIndex === instructions.length - 1);
            return newIndex;
        });
    };

    const regressInstruction = () => {
        setCurrentInstructionIndex((prev) => {
            setIsEndOfInstructions(false);
            return Math.max(prev - 1, 0);
        });
    };

    const skip = () => {
        setCurrentInstructionIndex(instructions.length - 1);
        setIsEndOfInstructions(true);
    };

    return (
        <GettingStartedInstructionContext.Provider value={{
            currentTarget,
            setCurrentTarget,
            advanceInstruction,
            regressInstruction,
            isEndOfInstructions,
            skip,
            registerTargetRect,
            getInstruction,
            getTargetRect,
            getMessagePosition
        }}>
            {children}
        </GettingStartedInstructionContext.Provider>
    )
}

/**
 * A hook to access the getting started instruction context. It provides:
 * - `currentTarget`: the current UI element that the instruction is referring to. This can be used to highlight the element in the UI.
 * - `setCurrentTarget`: a function to set the current target.
 * - `getInstruction`: a function to get the current instruction text as a React node to be displayed in the instruction overlay.
 * - `advanceInstruction`: a function to advance to the next instruction in the sequence.
 * - `registerTargetRect`: a function to register the bounding rectangle of a UI element.
 * - `getTargetRect`: a function to get the bounding rectangle of the current target UI element, which can be used to position the instruction overlay accordingly.
 *
 * **NOTE**: This hook must be used within a `GettingStartedInstructionProvider`, which is provided in the `GettingStartedLayout`.
 * @returns The getting started instruction context.
 */
export function useGettingStartedInstruction() {
    const context = useContext(GettingStartedInstructionContext);
    return context;
}