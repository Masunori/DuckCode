"use client";

import { useGameplayStore } from "../../../hooks/useGameplayStore";
import styles from "../page.module.css";

export default function Output() {
    const codeOutput = useGameplayStore(state => state.codeOutput);

    const CODE_FAIL_BORDER_COLOR = 'var(--error-code-text-border-color)';
    const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

    return (
        <div className={styles.codeOutputContainer}>
            <div className={styles.codeOutput}>
                {codeOutput.map((line, index) => (
                    <code key={index} style={{
                        color: line.type === "error"
                            ? CODE_FAIL_BORDER_COLOR
                            : line.type === "warn"
                            ? CODE_WARNING_COLOR
                            : "var(--font-colour)"
                    }}>
                        {line.content}
                    </code>
                ))}
            </div>
        </div>
    );
}