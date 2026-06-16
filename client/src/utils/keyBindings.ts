export type KeyBinding = {
    action: string;
    combo: {
        ctrl: boolean;
        shift: boolean;
        key: string;
    }
}

export type GameplayKeyBindingNames =
    "FOCUS_EDITOR"
    | "DEFOCUS_EDITOR"
    | "RUN_CODE_OUTPUT_MODE"
    | "RUN_TEST_CASES"
    | "TOGGLE_OUTPUT_TEST_CASE_MODE"
    | "SUBMIT_CODE"
    | "EXIT_TAB_ON_FULLSCREEN"
    | "TOGGLE_QUESTION_TAB"
    | "TOGGLE_OUTPUT_TAB"
    | "TOGGLE_TEST_CASES_TAB"
    | "PREVIOUS_QUESTION"
    | "NEXT_QUESTION";

export const GAMEPLAY_KEY_BINDINGS: Record<GameplayKeyBindingNames, KeyBinding> = {
    FOCUS_EDITOR: {
        action: "Focus on code editor",
        combo: { ctrl: false, shift: false, key: 'I' }
    },
    DEFOCUS_EDITOR: {
        action: "Defocus from code editor",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    },
    RUN_CODE_OUTPUT_MODE: {
        action: "Run code (Output Mode)",
        combo: { ctrl: true, shift: false, key: 'Enter' }
    },
    RUN_TEST_CASES: {
        action: "Run code (Test Cases Mode)",
        combo: { ctrl: true, shift: true, key: 'Enter' }
    },
    TOGGLE_OUTPUT_TEST_CASE_MODE: {
        action: "Toggle Output/Test Case Mode",
        combo: { ctrl: false, shift: false, key: 'T' }
    },
    SUBMIT_CODE: {
        action: "Submit code",
        combo: { ctrl: false, shift: false, key: 'S' }
    },
    EXIT_TAB_ON_FULLSCREEN: {
        action: "(Only Fullscreen Editor Layout) Escape from Question, Test Cases or Output Mode",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    },
    TOGGLE_QUESTION_TAB: {
        action: "(Only Fullscreen Editor Layout) Toggle Question Mode",
        combo: { ctrl: false, shift: true, key: 'Q' }
    },
    TOGGLE_OUTPUT_TAB: {
        action: "(Only Fullscreen Editor Layout) Toggle Output Mode",
        combo: { ctrl: false, shift: true, key: 'O' }
    },
    TOGGLE_TEST_CASES_TAB: {
        action: "(Only Fullscreen Editor Layout) Toggle Test Cases Mode",
        combo: { ctrl: false, shift: true, key: 'C' }
    },
    PREVIOUS_QUESTION: {
        action: "Go to previous question",
        combo: { ctrl: false, shift: false, key: 'ArrowLeft' }
    },
    NEXT_QUESTION: {
        action: "Go to next question",
        combo: { ctrl: false, shift: false, key: 'ArrowRight' }
    }
}

export type GeneralKeyBindingNames = "OPEN_SETTINGS" | "CLOSE_SETTINGS" | "CONFIRM_POPUP" | "CANCEL_POPUP";

export const GENERAL_KEY_BINDINGS: Record<GeneralKeyBindingNames, KeyBinding> = {
    OPEN_SETTINGS: {
        action: "Open settings",
        combo: { ctrl: false, shift: false, key: 'F1' },
    },
    CLOSE_SETTINGS: {
        action: "Escape settings",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    },
    CONFIRM_POPUP: {
        action: "Popup - Confirm decision",
        combo: { ctrl: false, shift: false, key: 'Enter' }
    },
    CANCEL_POPUP: {
        action: "Popup - Cancel decision",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    }
}

export type MultiplayerKeyBindingNames =
    "TOGGLE_TEAM_TAB"
    | "TOGGLE_PLAYER_1_TAB"
    | "TOGGLE_PLAYER_2_TAB"
    | "TOGGLE_PLAYER_3_TAB"
    | "OPEN_CHATBOX"
    | "CLOSE_CHATBOX"
    | "SEND_CHAT_MESSAGE"
    | "TOGGLE_CANVAS";

export const MULTIPLAYER_KEY_BINDINGS: Record<MultiplayerKeyBindingNames, KeyBinding> = {
    TOGGLE_TEAM_TAB: {
        action: "Toggle Team Code Editor Tab",
        combo: { ctrl: false, shift: false, key: '1' }
    },
    TOGGLE_PLAYER_1_TAB: {
        action: "Toggle Player 1's Code Editor Tab",
        combo: { ctrl: false, shift: false, key: '2' }
    },
    TOGGLE_PLAYER_2_TAB: {
        action: "Toggle Player 2's Code Editor  Tab",
        combo: { ctrl: false, shift: false, key: '3' }
    },
    TOGGLE_PLAYER_3_TAB: {
        action: "Toggle Player 3's Code Editor  Tab (only if the team has 3 players)",
        combo: { ctrl: false, shift: false, key: '4' }
    },
    OPEN_CHATBOX: {
        action: "Open Chatbox",
        combo: { ctrl: false, shift: false, key: 'Enter' }
    },
    CLOSE_CHATBOX: {
        action: "Close Chatbox",
        combo: { ctrl: false, shift: false, key: 'Escape' }
    },
    SEND_CHAT_MESSAGE: {
        action: "Send Chat Message",
        combo: { ctrl: false, shift: false, key: 'Enter' }
    },
    TOGGLE_CANVAS: {
        action: "Toggle Whiteboard Canvas",
        combo: { ctrl: false, shift: true, key: 'B' }
    },
}

/**
 * Checks whether a keyboard event's recorded keys match a specified key combination (combo)
 * @param event The keyboard event
 * @param combo The key combo
 * @returns true if the event's keys match the key combination, false otherwise
 */
export function isKeyCombo(event: KeyboardEvent, combo: { ctrl: boolean, shift: boolean, key: string }) {
    const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const comboKey = combo.key.length === 1 ? combo.key.toLowerCase() : combo.key;

    return (
        event.ctrlKey === combo.ctrl
        && event.shiftKey === combo.shift
        && eventKey === comboKey
    );
}

/**
 * Translates a combo object into a readable string.
 * @param combo The combo object
 * @returns The string representation of the combo
 */
export function translateCombo(combo: { ctrl: boolean, shift: boolean, key: string }): string {
    if (combo.ctrl) {
        if (combo.shift) {
            return "CTRL + Shift + " + combo.key;
        } else {
            return "CTRL + " + combo.key;
        }
    } else if (combo.shift) {
        return "Shift + " + combo.key;
    } else {
        return combo.key;
    }
}