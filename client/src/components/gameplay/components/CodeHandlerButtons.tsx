type CodeHandlerButtonsProps = {
    onRunCode: () => void;
    onRunTestCases: () => void;
    onSubmitCode: () => void;
}

import styles from '../page.module.css';
import { useBaseGameplayStore } from '@/lib/gameplay/hooks/useBaseGameplayStore';

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
            >Run Code</button>
            <button
                className={styles.runAllTestCasesButton}
                onClick={onRunTestCases}
                disabled={isLocked}
                style={{ 
                    pointerEvents: isLocked ? "none" : "auto" 
                }}
            >Run All Test Cases</button>
            <button
                className={styles.submitCodeButton}
                onClick={onSubmitCode}
                disabled={isLocked}
                style={{ 
                    pointerEvents: isLocked ? "none" : "auto" 
                }}
            >Submit</button>
        </div>
    )
}