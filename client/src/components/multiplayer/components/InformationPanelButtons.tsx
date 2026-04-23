"use client";

import { useShallow } from 'zustand/shallow';
import styles from '../page.module.css';
import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/lib/utils/keyBindings';
import { useMultiplayerGameplayStore } from '@/lib/multiplayer/hooks/useMultiplayerGameplayStore';

export default function InformationPanelButtons() {
    const [informationMode, setInformationMode] = useMultiplayerGameplayStore(
        useShallow(
            state => [state.informationMode, state.setInformationMode]
        )
    );

    return (
        <div className={styles.informationPanelButtons}>
            <button
                className={informationMode === "question" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("question")}
            ><b>Question</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_QUESTION_TAB"].combo)}]</kbd></button>
            <button
                className={informationMode === "testCases" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("testCases")}
            ><b>Test Cases</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_TEST_CASES_TAB"].combo)}]</kbd></button>
            <button
                className={informationMode === "output" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("output")}
            ><b>Output</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TAB"].combo)}]</kbd></button>
        </div>
    );
}