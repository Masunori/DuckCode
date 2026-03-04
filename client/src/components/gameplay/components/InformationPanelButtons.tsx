"use client";

import { useBaseGameplayStore } from '@/lib/gameplay/hooks/useBaseGameplayStore';
import { useShallow } from 'zustand/shallow';
import styles from '../page.module.css';
import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/components/settings/settingsUtils';
import { useUserPreferenceStore } from '@/contexts/UserPreferenceContext';

export default function InformationPanelButtons() {
    const [informationMode, setInformationMode] = useBaseGameplayStore(
        useShallow(
            state => [state.informationMode, state.setInformationMode]
        )
    );

    const userPreference = useUserPreferenceStore(state => state.userPreference);

    const toggleQuestionTabKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_QUESTION_TAB"].combo)}]</kbd>
        : "";

    const toggleTestCasesTabKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_TEST_CASES_TAB"].combo)}]</kbd>
        : "";

    const toggleOutputTabKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["TOGGLE_OUTPUT_TAB"].combo)}]</kbd>
        : "";

    return (
        <div className={styles.informationPanelButtons}>
            <button
                className={informationMode === "question" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("question")}
            ><b>Question</b> {toggleQuestionTabKeyHint}</button>
            <button
                className={informationMode === "testCases" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("testCases")}
            ><b>Test Cases</b> {toggleTestCasesTabKeyHint}</button>
            <button
                className={informationMode === "output" ? styles.selected : styles.unselected}
                onClick={() => setInformationMode("output")}
            ><b>Output</b> {toggleOutputTabKeyHint}</button>
        </div>
    );
}