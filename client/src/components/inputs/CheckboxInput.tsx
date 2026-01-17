"use client";

import { useEffect, useState } from "react";
import styles from "./input.module.css";

type CheckboxInputProps = {
    inputId: string;
    inputName: string;
    defaultChecked: boolean;
    handleOptionChange: (checked: boolean) => void;
}

/**
 * Renders a checkbox input.
 * 
 * @param param0 The props
 * - `inputName (string)`: the description for the input
 * - `inputId (string)`: the checkbox contains a label and an input, use this value to set label's htmlFor and input's id attributes
 * - `defaultChecked (boolean)`: the default checked status of the checkbox input
 * - `handleOptionChange (string => void)`: the function that will be executed upon a change of the checked status
 * @returns 
 */
export default function CheckboxInput({ inputId, inputName, defaultChecked, handleOptionChange }: CheckboxInputProps) {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    function handleToggleChecked() {
        handleOptionChange(!isChecked);
        setIsChecked(prev => !prev);
    }

    // in case of a discard, we want to set the checked status to the default value
    useEffect(() => {
        setIsChecked(defaultChecked);
    }, [defaultChecked]);

    return (
        <div className={styles.checkboxInput}>
            <p>{inputName}</p>
            <label htmlFor={inputId}>
                <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggleChecked}
                />
            </label>
        </div>
    )
}