import { create } from "zustand";

type BoardControllerProps = {
    /** Whether the strategy board is open */
    isBoardOpen: boolean;

    /** Toggles the strategy board */
    setIsBoardOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * A Zustand store to manage the strategy board UI
 * 
 * - `isBoardOpen` and `setIsBoardOpen` manage the board's visibility. 
 */
export const useBoardController = create<BoardControllerProps>((set) => ({
    isBoardOpen: false,
    setIsBoardOpen: (bool) => 
        set((state) => ({
            isBoardOpen: typeof bool === "function"
                ? bool(state.isBoardOpen)
                : bool,
        })),
}));