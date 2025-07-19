type CodeHandlerButtonsProps = {
    onRunCode: () => void;
    onRunTestCases: () => void;
    onSubmitCode: () => void;
    isClusterLocked: boolean;
}

import styles from '../page.module.css';

export default function CodeHandlerButtons({ onRunCode, onRunTestCases, onSubmitCode, isClusterLocked }: CodeHandlerButtonsProps) {
    return (
        <div className={styles.codeHandlerButtons}>
            <button
                className={styles.runCodeButton}
                onClick={onRunCode}
                disabled={isClusterLocked}
                style={{ 
                    pointerEvents: isClusterLocked ? "none" : "auto" 
                }}
            >Run Code</button>
            <button
                className={styles.runAllTestCasesButton}
                onClick={onRunTestCases}
                disabled={isClusterLocked}
                style={{ 
                    pointerEvents: isClusterLocked ? "none" : "auto" 
                }}
            >Run All Test Cases</button>
            <button
                className={styles.submitCodeButton}
                onClick={onSubmitCode}
                disabled={isClusterLocked}
                style={{ 
                    pointerEvents: isClusterLocked ? "none" : "auto" 
                }}
            >Submit</button>
        </div>
    )
}