import { Question } from "./gameplayUtils";
import { ResizableLayout } from "./ResizableLayout";
import styles from "./page.module.css";
import { getQuestion } from "@/lib/apiClient/gameplay";

export default async function Page() {
    const question: Question = await getQuestion(1000);

    return (
        <div className={styles.container}>
            <ResizableLayout question={question} />
        </div>
    )
}