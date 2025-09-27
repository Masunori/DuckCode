import styles from "./progress.module.css";

/**
 * Represents a step in the progress bar.
 */
export type ProgressStep = {
    /** The identification of the step. */
    id: string;
    /** The progress name visible to the user. */
    label: string;
    /** The status of the step. */
    status: "unreached" | "active" | "completed";
    /** Whether the step can be navigated backwards to after its completion. */
    isBackwardNavigable: boolean;
}

export type LinearProgressBarProps = {
    progressSteps: ProgressStep[];
    onStepClick: (step: number) => void;
};

/**
 * Updates all post-requisites of a step to "unreached" if a user navigates backward to a backward-navigable step.
 * @param steps The list of progress steps.
 * @param stepIndex The index of the step that was navigated to.
 */
export const cascadePostRequisites = (steps: ProgressStep[], stepIndex: number) => {
    if (!steps[stepIndex].isBackwardNavigable) {
        return;
    }

    for (let i = stepIndex + 1; i < steps.length; i++) {
        const step = steps[i];
        step.status = "unreached";
    }
}

export const getActiveStepIndex = (steps: ProgressStep[]) => {
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].status === "active") {
            return i;
        }
    }
    return -1; // No active step found
}

/**
 * LinearProgressBar component to display the progress of a multi-step process, where it is assumed that all steps are done sequentially.
 * @param param0 The list of progress steps to display.
 * - `progressSteps`: An array of `ProgressStep` objects representing each step in the progress bar.
 * - `onStepClick`: Optional callback function that is called when a navigable step is clicked.
 * @returns A styled progress bar with the given steps.
 */
export default function LinearProgressBar({ 
    progressSteps,
    onStepClick 
}: LinearProgressBarProps) {
    const activeIndex = getActiveStepIndex(progressSteps);

    return (
        <div 
            className={styles.progressBar}
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${progressSteps.length - 1}, 2fr) 1fr`,
            }}
        >
            {progressSteps.map((step, index) => (
                <section 
                    key={index} 
                    className={styles.progressStep}
                    style={{
                        display: "grid",
                        gridTemplateColumns: index < progressSteps.length - 1 ? "repeat(2, 1fr)" : "1fr",
                        gridTemplateRows: "repeat(2, 1fr)",
                        gridTemplateAreas: index < progressSteps.length - 1 
                            ? `
                                "step bar"
                                "step _"
                            `
                            : `
                                "step"
                                "step"
                            `
                    }}
                >
                    <button
                        onClick={() => { onStepClick(index); }}
                        className={
                            step.status === "unreached"
                                ? styles.stepButtonUnreached
                                : step.status === "active"
                                    ? styles.stepButtonActive
                                    : activeIndex >= index && step.isBackwardNavigable
                                        ? styles.stepButtonCompletedNavigable
                                        : styles.stepButtonCompletedUnnavigable
                        }
                        style={{
                            cursor: step.isBackwardNavigable && index <= activeIndex
                                ? "pointer" 
                                : "not-allowed",
                            gridArea: "step",
                            display: "grid",
                            gridTemplateRows: "repeat(2, 1fr)"
                        }}
                        disabled={step.status === "unreached" || (step.status === "completed" && !step.isBackwardNavigable)}
                    >
                        <div className={styles.stepIndex}>
                            {step.status === "completed" ? "✔" : index + 1}
                        </div>
                        <div>{step.label}</div>
                    </button>
                    {index < progressSteps.length - 1 && (
                        <div className={styles.stepConnector} style={{ gridArea: "bar" }}>
                            <div 
                                className={`${styles.completionBar} ${step.status === "completed" ? styles.completed : styles.unreached}`}
                            ></div>
                        </div>
                    )}
                </section>
            ))}
        </div>
    )
}