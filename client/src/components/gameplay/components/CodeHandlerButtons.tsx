type CodeHandlerButtonsProps = {
    onRunCode: () => void;
    onRunTestCases: () => void;
    onSubmitCode: () => void;
}

import { useUserPreferenceStore } from '@/contexts/UserPreferenceContext';
import { useBaseGameplayStore } from '@/hooks/useBaseGameplayStore';
import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/utils/keyBindings';
import styles from '../page.module.css';

export default function CodeHandlerButtons({ onRunCode, onRunTestCases, onSubmitCode }: CodeHandlerButtonsProps) {
    const isLocked = useBaseGameplayStore(state => state.isLocked);
    const codeContent = useBaseGameplayStore(state => state.codeContent[0]);
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const isCodeEmpty = codeContent.trim() === "";

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
                disabled={isLocked || isCodeEmpty}
            ><b>Run Code</b> {runCodeKeyHint}</button>
            <button
                className={styles.runAllTestCasesButton}
                onClick={onRunTestCases}
                disabled={isLocked || isCodeEmpty}
            ><b>Run All Test Cases</b> {runTestCasesKeyHint}</button>
            <button
                className={styles.submitCodeButton}
                onClick={onSubmitCode}
                disabled={isLocked || isCodeEmpty}
            ><b>Submit</b> {submitCodeKeyHint}</button>
        </div>
    )
}