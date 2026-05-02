"use client";

import { useRef, useState } from "react";
import styles from "./page.module.css";
import { addQuestion, Example, FullQuestion, FullTestCase } from "@/lib/apiClient/admin";

const emptyFullQuestion: FullQuestion = {
    questionid: -1,
    title: "",
    difficulty: -1,
    description: "",
    input_type: "",
    output_type: "",
    ques_constraint: "",
    example: { input: "", output: "", explanation: "" },
    testcases: [],
}

type ExampleComponentProps = {
    onSave: (example: Example) => void;
}

function ExampleComponent({ onSave }: ExampleComponentProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const explanationRef = useRef<HTMLTextAreaElement>(null);

    const handleSave= () => {
        const updatedExample: Example = {
            input: inputRef.current?.value || "",
            output: outputRef.current?.value || "",
            explanation: explanationRef.current?.value || "",

        }
        onSave(updatedExample);
    }
    
    return (
        <div className={styles.exampleContainer}>
            <label>
                Input: <textarea ref={inputRef}/>
            </label>
            <label>
                Output: <textarea ref={outputRef} />
            </label>
            <label>
                Explanation: <textarea ref={explanationRef} />
            </label>
            <button type="button" onClick={handleSave}>Save</button>
        </div>
    )
}

type TestCaseComponentProps = {
    onSave: (testCase: FullTestCase) => void;
}

function TestCaseComponent({ onSave }: TestCaseComponentProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const expectedOutputRef = useRef<HTMLTextAreaElement>(null);
    const isPublicRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        const updatedTestCase: FullTestCase = {
            input: inputRef.current?.value || "",
            expectedOutput: expectedOutputRef.current?.value || "",
            isPublic: isPublicRef.current?.checked || false,
        };
        onSave(updatedTestCase);
    };

    return (
        <div className={styles.testCaseContainer}>
            <label>
                Input: <textarea ref={inputRef} />
            </label>
            <label>
                Expected Output: <textarea ref={expectedOutputRef} />
            </label>
            <label>
                Public: <input type="checkbox" ref={isPublicRef} />
            </label>
            <button type="button" onClick={handleSave}>Save</button>
        </div>
    );

}

export default function AdminPage() {
    const [question, setQuestion] = useState<FullQuestion>(structuredClone(emptyFullQuestion));

    const handleAddQuestion = async () => {
        try {
            const response = await addQuestion(question);

            if (response.ok) {
                alert("Question added successfully!");
                setQuestion(structuredClone(emptyFullQuestion)); // Reset the form
            } else {
                const err = await response.json();
                alert("Failed to add question: " + (err.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding question:", error);
            alert("An unexpected error occurred while adding the question.");
        }
    }

    return <div className={styles.container}>
        <section className={styles.addQuestionSection}>
            <h2>Add a question</h2>
            <form>
                <label>
                    QID: <input type="string" value={question.questionid} onChange={e => setQuestion({ ...question, questionid: e.target.value })} />
                </label>
                <label>
                    Title: <input type="text" value={question.title} onChange={e => setQuestion({ ...question, title: e.target.value })} />
                </label>
                <br />
                <label>
                    Description: <textarea value={question.description} onChange={e => setQuestion({ ...question, description: e.target.value })} />
                </label>
                <label>
                    Difficulty: <input type="number" value={question.difficulty} onChange={e => setQuestion({ ...question, difficulty: parseInt(e.target.value) || 0 })} />
                </label>
                <label>
                    Input Description: <textarea value={question.input_type} onChange={e => setQuestion({ ...question, input_type: e.target.value })} />
                </label>
                <label>
                    Output Description: <textarea value={question.output_type} onChange={e => setQuestion({ ...question, output_type: e.target.value })} />
                </label>
                <label>
                    Constraints: <textarea value={question.ques_constraint} onChange={e => setQuestion({ ...question, ques_constraint: e.target.value })} />
                </label>
                <label>
                    Examples:
                    {/* {question.example.map((example, index) => (
                        <div className={styles.exampleWithRemove} key={index}>
                            <div className={styles.index}>{index}</div>
                            <ExampleComponent onSave={updatedExample => {
                                const newExamples = [...question.example];
                                newExamples[index] = updatedExample;
                                setQuestion({ ...question, example: newExamples });
                            }} />
                            <button className={styles.remove} type="button" onClick={() => {
                                const newExamples = [...question.example];
                                newExamples.splice(index, 1);
                                setQuestion({ ...question, example: newExamples });
                            }}>Remove</button>
                        </div>
                    ))}
                    <button className={styles.add} type="button" onClick={() => setQuestion({ ...question, example: [...question.example, { input: "", output: "", explanation: "" }] })}>Add Example</button> */}
                    <div className={styles.exampleWithRemove}>
                        <div className={styles.index}>{0}</div>
                        <ExampleComponent onSave={updatedExample => {
                            setQuestion({ ...question, example: updatedExample });
                        }} />
                        <button className={styles.remove} type="button" onClick={() => {
                            setQuestion({ ...question, example: { input: "", output: "", explanation: "" } });
                        }}>Remove</button>
                    </div>
                </label>
                <label>
                    Test Cases:
                    {question.testcases.map((testCase, index) => (
                        <div className={styles.testCaseWithRemove} key={index}>
                            <div className={styles.index}>{index}</div>
                            <TestCaseComponent onSave={updatedTestCase => {
                                const newTestCases = [...question.testcases];
                                newTestCases[index] = updatedTestCase;
                                setQuestion({ ...question, testcases: newTestCases });
                            }} />
                            <button className={styles.remove} type="button" onClick={() => {
                                const newTestCases = [...question.testcases];
                                newTestCases.splice(index, 1);
                                setQuestion({ ...question, testcases: newTestCases });
                            }}>Remove</button>
                        </div>
                    ))}
                    <button className={styles.add} type="button" onClick={() => setQuestion({ ...question, testcases: [...question.testcases, { input: "", expectedOutput: "", isPublic: false }] })}>Add Test Case</button>
                </label>
                <button className={styles.addNewQuestionButton} type="button" onClick={handleAddQuestion}>
                    Add new question
                </button>
            </form>
        </section>
        <section className={styles.questionPreview}>
            <h2>Question preview</h2>
            <div>
                <pre>
                    {JSON.stringify(question, null, 2)}
                </pre>
            </div>
        </section>
    </div>
}