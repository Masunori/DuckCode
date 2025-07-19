import { Question } from "../gameplayUtils";
import styles from "../page.module.css";

export default function QuestionDisplay({ question }: { question: Question }) {
    return (
        <div className={styles.question}>
            <h1>{question.title}</h1>
            <h3>Difficulty: {question.difficulty}</h3>

            <div>
                <h3>Description</h3>
                {question.description.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>

            <div>
                <h3>Input</h3>
                <ul>
                    {question.input.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Output</h3>
                <ul>
                    {question.output.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Examples</h3>
                {question.examples.map((example, index) => (
                    <div key={index} className={styles.example}>
                        <div className={styles.decoratorLine}></div>
                        <div className={styles.exampleContent}>
                            <h4>Input:</h4>
                            {example.input.map((line, i) => (
                                <span key={i}><code>{line}</code></span>
                            ))}

                            <h4>Output:</h4>
                            {example.output.map((line, i) => (
                                <span key={i}><code>{line}</code></span>
                            ))}

                            <h4>Explanation:</h4>
                            {example.explanation || "None"}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3>Constraints:</h3>
                <ul>
                    {question.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}