type CodeHandlerButtonsProps = {
    onRunCode: () => void;
    onRunTestCases: () => void;
    onSubmitCode: () => void;
}

import { GAMEPLAY_KEY_BINDINGS, translateCombo } from '@/components/settings/settingsUtils';
import { useBaseGameplayStore } from '@/lib/gameplay/hooks/useBaseGameplayStore';
import styles from '../page.module.css';

export default function CodeHandlerButtons({ onRunCode, onRunTestCases, onSubmitCode }: CodeHandlerButtonsProps) {
    const isLocked = useBaseGameplayStore(state => state.isLocked);

    return (
        <div className={styles.codeHandlerButtons}>
            <button
                className={styles.runCodeButton}
                onClick={onRunCode}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Run Code</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_CODE_OUTPUT_MODE"].combo)}]</kbd></button>
            <button
                className={styles.runAllTestCasesButton}
                onClick={onRunTestCases}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Run All Test Cases</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["RUN_TEST_CASES"].combo)}]</kbd></button>
            <button
                className={styles.submitCodeButton}
                onClick={onSubmitCode}
                disabled={isLocked}
                style={{
                    pointerEvents: isLocked ? "none" : "auto"
                }}
            ><b>Submit</b> <kbd>[{translateCombo(GAMEPLAY_KEY_BINDINGS["SUBMIT_CODE"].combo)}]</kbd></button>
        </div>
    )
}