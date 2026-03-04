type CodeHandlerButtonsProps = {
    onRunCode: () => void;
    onRunTestCases: () => void;
    onSubmitCode: () => void;
}

import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/components/settings/settingsUtils';
import { useBaseGameplayStore } from '@/lib/gameplay/hooks/useBaseGameplayStore';
import styles from '../page.module.css';
import { useUserPreferenceStore } from '@/contexts/UserPreferenceContext';

export default function CodeHandlerButtons({ onRunCode, onRunTestCases, onSubmitCode }: CodeHandlerButtonsProps) {
    const isLocked = useBaseGameplayStore(state => state.isLocked);
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    
    const runCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)}]</kbd>
        : "";

    const runTestCasesKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)}]</kbd>
        : "";

    const submitCodeKeyHint = userPreference.displayKeyBindingOnButtons
        ? <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)}]</kbd>
        : "";

    return (
        <div className={styles.codeHandlerButtons}>
            <button
                className={styles.runCodeButton}
                onClick={onRunCode}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Run Code</b> {runCodeKeyHint}</button>
            <button
                className={styles.runAllTestCasesButton}
                onClick={onRunTestCases}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Run All Test Cases</b> {runTestCasesKeyHint}</button>
            <button
                className={styles.submitCodeButton}
                onClick={onSubmitCode}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Submit</b> {submitCodeKeyHint}</button>
        </div>
    )
}