"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Question } from "../../../gameplayUtils";
import styles from "../page.module.css";
import { motion, AnimatePresence } from "motion/react";

type QuestionDisplayProps = {
    question: Question;
    informationMode: "Question" | "Test Cases" | "Output" | "";
    setInformationMode: Dispatch<SetStateAction<"Question" | "Test Cases" | "Output" | "">>;
}

export default function QuestionDisplay({ question, informationMode, setInformationMode }: QuestionDisplayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const questionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && questionRef.current
                && overlayRef.current.contains(event.target as Node)
                && !questionRef.current.contains(event.target as Node)
            ) {
                setInformationMode("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    })

    return (
        <AnimatePresence>
            {informationMode === "Question" && (
                <>
                    <motion.div 
                        className={styles.questionOverlay}
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75 }}
                    ></motion.div>
                    <motion.div 
                        className={styles.question}
                        ref={questionRef}
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: "0%" }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.75 }}
                    >
                        <motion.h1>{question.title}</motion.h1>
                        <motion.h3>Difficulty: {question.difficulty}</motion.h3>

                        <motion.div>
                            <motion.h3>Description</motion.h3>
                            {question.description.map((line, index) => (
                                <motion.p key={index}>{line}</motion.p>
                            ))}
                        </motion.div>

                        <motion.div>
                            <motion.h3>Input</motion.h3>
                            <motion.ul>
                                {question.input.map((line, index) => (
                                    <motion.li key={index}>{line}</motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>

                        <motion.div>
                            <motion.h3>Output</motion.h3>
                            <motion.ul>
                                {question.output.map((line, index) => (
                                    <motion.li key={index}>{line}</motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>

                        <motion.div>
                            <motion.h3>Examples</motion.h3>
                            {question.examples.map((example, index) => (
                                <motion.div key={index} className={styles.example}>
                                    <motion.div className={styles.decoratorLine}></motion.div>
                                    <motion.div className={styles.exampleContent}>
                                        <motion.h4>Input:</motion.h4>
                                        {example.input.map((line, i) => (
                                            <motion.span key={i}><motion.code>{line}</motion.code></motion.span>
                                        ))}

                                        <motion.h4>Output:</motion.h4>
                                        {example.output.map((line, i) => (
                                            <motion.span key={i}><motion.code>{line}</motion.code></motion.span>
                                        ))}

                                        <motion.h4>Explanation:</motion.h4>
                                        {example.explanation || "None"}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div>
                            <motion.h3>Constraints:</motion.h3>
                            <motion.ul>
                                {question.constraints.map((constraint, index) => (
                                    <motion.li key={index}>{constraint}</motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}