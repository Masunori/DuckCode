import { InformationMode } from "../gameplayUtils";
import { Lock } from "@/app/utils/lock";
import { create } from "zustand";
import { SetState } from "@/app/utils/types";

type GameplayControllerProps = {
    /** The index of the test case currently rendered in the test case panel (active test case) */
    activeIndex: number;
    /** Sets the index of the active test case */
    setActiveIndex: SetState<number>;
    /** Whether the question, test case information or code output should be displayed (information mode) */
    informationMode: InformationMode;
    /** Sets the information mode (`"question"`, `"testCases"`, `"output"` or `"-"`) */
    setInformationMode: SetState<InformationMode>;
    /** A utility to enforce that the user executes code, he/she cannot execute it until the current execution ends */
    lock: Lock;
    /** Whether the cluster of code execution functions that share the same lock (run code, run code against test cases, submit code) is being locked. */
    isClusterLocked: boolean;
    /** Sets the locked state of the code execution function cluster */
    setIsClusterLocked: SetState<boolean>;
};

/**
 * A Zustand store that manages gameplay logic.
 * - `activeIndex` and `setActiveIndex` controls which test case is being displayed. The test case selector will utilise 
 * `setActiveIndex`, while the test case results display will use the `activeIndex`.
 * - `lock`, `isClusterLocked`, `setIsClusterLocked` controls code execution functions. The code handler buttons will use these.
 * - `informationMode` and `setInformationMode` controls what information the user sees. In default and inverted layouts,
 * the user has to toggle between `testCases` and `output`. In two tabs and two tabs inverted, they additionally have to 
 * toggle `question`. In fullscreen editor, the user additionally has to toggle both `question` and `-` (which means that
 * nothing is displayed because everything is a toggle action). Since each layout has different information modes to toggle
 * between, they will handle with corresponding key bindings and visual.
 */
export const useGameplayController = create<GameplayControllerProps>((set) => ({
    activeIndex: 0,
    informationMode: "-",
    lock: new Lock(),
    isClusterLocked: false,

    setActiveIndex: (index) =>
        set((state) => ({
            activeIndex: typeof index === "function"
                ? index(state.activeIndex)
                : index
        })),
    setInformationMode: (mode) =>
        set((state) => ({
            informationMode: typeof mode === "function"
                ? mode(state.informationMode)
                : mode
        })),
    setIsClusterLocked: (bool) =>
        set((state) => ({
            isClusterLocked: typeof bool === "function"
                ? bool(state.isClusterLocked)
                : bool
        })),
}))