import { OutputEntry } from "@/lib/apiClient/runCodeStatuses";
import { SetState } from "@/lib/utils/types";
import { create } from "zustand";
import { placeholderQuestion, Question, TestCaseResult } from "@/lib/gameplay/utils";

type GameplayStoreProps = {
    /** The current code content in the editor */
    codeContent: string;
    /** Sets the code content */
    setCodeContent: SetState<string>;
    /** The test case results after running the code against public test cases */
    testCaseResults: TestCaseResult[];
    /** Sets the test case results */
    setTestCaseResults: SetState<TestCaseResult[]>;
    /** The output after running the code normally */
    codeOutput: OutputEntry[];
    /** Sets the code output */
    setCodeOutput: SetState<OutputEntry[]>;
    /** The question to solve */
    question: Question;
    /** Sets the question */
    setQuestion: SetState<Question>;
    initialTime: number;
    setInitialTime: SetState<number>;
};

/**
 * A Zustand store that stores gameplay data.
 * - `question` and `setQuestion` controls the problem to solve for the match
 * - `activeIndex` and `setActiveIndex` controls which test case is being displayed. The test case selector will utilise 
 * `setActiveIndex`, while the test case results display will use the `activeIndex`.
 * - `lock`, `isClusterLocked`, `setIsClusterLocked` controls code execution functions. The code handler buttons will use these.
 * - `informationMode` and `setInformationMode` controls what information the user sees. In default and inverted layouts,
 * the user has to toggle between `testCases` and `output`. In two tabs and two tabs inverted, they additionally have to 
 * toggle `question`. In fullscreen editor, the user additionally has to toggle both `question` and `-` (which means that
 * nothing is displayed because everything is a toggle action). Since each layout has different information modes to toggle
 * between, they will handle with corresponding key bindings and visual.
 * - `codeContent` and `setCodeContent` control what the user sees in the code editor. The code editor UI will use this.
 * - `testCaseResults` and `setTestCaseResults` control the test case results after running the code. The test case panel UI will use this.
 * - `codeOutput` and `setCodeOutput` control the result wieh executing the code normally. The code output UI will use this.
 */
export const useGameplayStore = create<GameplayStoreProps>((set) => ({
    question: placeholderQuestion,
    codeContent: "",
    testCaseResults: [],
    codeOutput: [{ type: "log", content: ">> Your code results will be displayed here..." }],
    initialTime: 60,

    setCodeContent: (code) =>
        set((state) => ({
            codeContent: typeof code === "function"
                ? code(state.codeContent)
                : code
        })),
    setTestCaseResults: (results) =>
        set((state) => ({
            testCaseResults: typeof results === "function"
                ? results(state.testCaseResults)
                : results
        })),
    setCodeOutput: (output) =>
        set((state) => ({
            codeOutput: typeof output === "function"
                ? output(state.codeOutput)
                : output
        })),
    setQuestion: (question) =>
        set((state) => ({
            question: typeof question === "function"
                ? question(state.question)
                : question
        })),
    setInitialTime: (time) =>
        set((state) => ({
            initialTime: typeof time === "function"
                ? time(state.initialTime)
                : time
        }))
}))