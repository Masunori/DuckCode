"use client"

import { useState } from "react";
import styles from './input.module.css';

type RadioInputProps = {
    inputName: string;
    options: string[];
    defaultOptionIndex: number;
    handleOptionChosen: (index: number) => void;
}

/**
 * Renders a set of radio inputs.
 * 
 * @param param0 The props
 * - `inputName (string)`: the description of the input
 * - `inputId (string)`: the RadioInput contains a set of labels and inputs, use this value to set the prefix for label's htmlFor and input's id attributes
 * - `defaultOptionIndex (string)`: the index of the default chosen option, in which the user must make sure that it is within the bounds of options
 * - `handleOptionChange (number => void)`: the function that will be executed upon a change of option
 * @returns 
 */
export default function RadioInput({ inputName, options, defaultOptionIndex, handleOptionChosen }: RadioInputProps) {
    const [selectedIndex, setSelectedIndex] = useState(defaultOptionIndex);

    function handleClick(index: number) {
        setSelectedIndex(index);
        handleOptionChosen(index);
    };

    return (
        <div className={styles.radioInputs}>
            <p>{inputName}</p>
            <ul>
                {options.map((option, index) => (
                    <li key={index} onClick={() => handleClick(index)}>
                        <div>
                            {option}
                        </div>
                        <div className={styles.radioButton}>
                            <div style={{
                                scale: index === selectedIndex ? 1 : 0
                            }}>

                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}