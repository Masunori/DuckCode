"use client"

import { useEffect, useState } from "react";
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
 * - `options (string[])`: the options that the user can choose from
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

    // in case of a discard, we want to set the selected index to the default option index
    useEffect(() => {
        setSelectedIndex(defaultOptionIndex);
    }, [defaultOptionIndex]);

    return (
        <div className={styles.radioInputs}>
            <h3><b>{inputName}</b></h3>
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