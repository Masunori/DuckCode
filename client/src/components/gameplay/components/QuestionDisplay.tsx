"use client";

import { Question } from "@/lib/gameplay/utils";
import styles from "../page.module.css";
import { useEffect, useRef } from "react";
import { useGettingStartedInstruction } from "@/contexts/GettingStartedInstructionContext";

export default function QuestionDisplay({ question }: { question: Question }) {
    const questionDisplayRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const difficultyRef = useRef<HTMLHeadingElement | null>(null);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLDivElement | null>(null);
    const outputRef = useRef<HTMLDivElement | null>(null);
    const examplesRef = useRef<HTMLDivElement | null>(null);
    const constraintsRef = useRef<HTMLDivElement | null>(null);

    const ctx = useGettingStartedInstruction();

    useEffect(() => {
        const update = () => {
            if (questionDisplayRef.current) {
                ctx?.registerTargetRect("question-display", questionDisplayRef.current.getBoundingClientRect());
            }

            if (titleRef.current) {
                ctx?.registerTargetRect("question-title", titleRef.current.getBoundingClientRect());
            }

            if (difficultyRef.current) {
                ctx?.registerTargetRect("question-difficulty", difficultyRef.current.getBoundingClientRect());
            }
            
            if (descriptionRef.current) {
                ctx?.registerTargetRect("question-description", descriptionRef.current.getBoundingClientRect());
            }

            if (inputRef.current) {
                ctx?.registerTargetRect("question-input", inputRef.current.getBoundingClientRect());
            }

            if (outputRef.current) {
                ctx?.registerTargetRect("question-output", outputRef.current.getBoundingClientRect());
            }

            if (examplesRef.current) {
                ctx?.registerTargetRect("question-examples", examplesRef.current.getBoundingClientRect());
            }
            
            if (constraintsRef.current) {
                ctx?.registerTargetRect("question-constraints", constraintsRef.current.getBoundingClientRect());
            }
        }

        update();

        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div className={styles.question} ref={questionDisplayRef}>
            <h1 ref={titleRef}>{question.title}</h1>
            <h3 ref={difficultyRef}>Difficulty: {question.difficulty}</h3>

            <div ref={descriptionRef}>
                <h3>Description</h3>
                {question.description.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>

            <div ref={inputRef}>
                <h3>Input</h3>
                <ul>
                    {question.input.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>

            <div ref={outputRef}>
                <h3>Output</h3>
                <ul>
                    {question.output.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </div>

            <div ref={examplesRef}>
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
                            {example?.explanation ?? "None"}
                        </div>
                    </div>
                ))}
            </div>

            <div ref={constraintsRef}>
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