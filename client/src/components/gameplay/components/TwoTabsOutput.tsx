"use client";

import styles from "./twoTabs.module.css";
import { useBaseGameplayStore } from "@/lib/gameplay/hooks/useBaseGameplayStore";

const CODE_FAIL_COLOR = 'var(--wrong-indicator-color)';
const CODE_WARNING_COLOR = 'var(--warn-code-text-border-color)';

export default function TwoTabsOutput() {
    const codeOutput = useBaseGameplayStore(state => state.codeOutput);

    return (
        <div className={styles.codeOutputContainer}>
            <div className={styles.codeOutput}>
                {codeOutput.map((line, index) => (
                    <code key={index} style={{
                        color: line.type === "error"
                            ? CODE_FAIL_COLOR
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