import { InformationMode } from "../multiplayerUtils";
import { Lock } from "@/app/utils/lock";
import { create } from "zustand";

type GameplayControllerProps = {
    /** The index of the test case currently rendered in the test case panel (active test case) */
    activeIndex: number;
    /** Sets the index of the active test case */
    setActiveIndex: (index: number) => void;
    /** The name of the user whose code editor tab (as well as whose test case results and code output) is being displayed (active tab) */
    activeTab: string;
    /** Sets the active tab */
    setActiveTab: (tab: string) => void;
    /** The list of user names whose code editor tabs are read-only */
    readOnlyTabs: string[];
    /** Sets the list of read-only tabs */
    setReadOnlyTabs: (readOnlyTabs: string[]) => void;
    /** Whether the question, test case information or code output should be displayed (information mode) */
    informationMode: InformationMode;
    /** Sets the information mode (`"question"`, `"testCases"`, `"output"` or `"-"`) */
    setInformationMode: (mode: InformationMode) => void;
    /** A utility to enforce that the user executes code, he/she cannot execute it until the current execution ends */
    lock: Lock;
    /** Whether the cluster of code execution functions that share the same lock (run code, run code against test cases, submit code) is being locked. */
    isClusterLocked: boolean;
    /** Sets the locked state of the code execution function cluster */
    setIsClusterLocked: (bool: boolean) => void;
};

/**
 * A Zustand store that manages gameplay logic.
 * - `activeIndex` and `setActiveIndex` controls which test case is being displayed. The test case selector will utilise 
 * `setActiveIndex`, while the test case results display will use the `activeIndex`.
 * - `activeTab` and `setActiveTab` controls whose code content, code output and test cases the user is viewing. The code editor,
 * the test case UI and the code output UI will use both of these.
 * - `readOnlyTabs` and `setReadOnlyTabs` controls whose code editor tab is only readable from the user. The code editor, the 
 * test case UI and the code output UI will use both of these.
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
    activeTab: "Team",
    lock: new Lock(),
    readOnlyTabs: [],
    isClusterLocked: false,

    setActiveIndex: (index) => set(({ activeIndex: index, })),
    setActiveTab: (tab) => set({ activeTab: tab, }),    
    setReadOnlyTabs: (readOnlyTabs) => set({ readOnlyTabs: readOnlyTabs }),
    setInformationMode: (mode) =>  set({ informationMode: mode, }),
    setIsClusterLocked: (bool) => set({ isClusterLocked: bool }),
}))