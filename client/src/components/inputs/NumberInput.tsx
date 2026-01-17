"use client";

import { CSSProperties, useEffect, useState } from "react";
import styles from "./input.module.css";

type NumberInputProps = {
    inputId: string;
    defaultValue: number;
    min: number;
    max: number;
    increment: number;
    inputName: string;
    handleInputChange: (num: number) => void; 
}

/**
 * Renders a number input.
 * 
 * @param param0 the props:
 * - `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
 * - `defaultValue (number)`: the default option, note that the user has to ensure this already bounded between `min` and `max`
 * - `min (number)`: the smallest value the input can hold, inclusive
 * - `max (number)`: the largest calue the input can hold, inclusive
 * - `increment (number)`: this input has a button that jumps the input up and down by some number more than 1, you can set it here
 * - `inputName (string)`: the text to describe the number input
 * - `handleInputChange (number => void)`: the function that is applied on the new number input
 * @returns 
 */
export default function NumberInput({ inputId, defaultValue, min, max, increment, inputName, handleInputChange }: NumberInputProps) {
    const [value, setValue] = useState(defaultValue);

    function handleValueChange(increment: number) {
        const newValue = Math.max(Math.min(max, value + increment), min); // cap the value between min and max
        setValue(newValue);
        handleInputChange(newValue);
    }

    const buttonStyleDecrement: CSSProperties = {
        pointerEvents: value > min ? "auto" : "none",
        opacity: value > min ? 1 : 0.5,
    }

    const buttonStyleIncrement: CSSProperties = {
        pointerEvents: value < max ? "auto" : "none",
        opacity: value < max ? 1 : 0.5,
    }

    // in case of a discard, we want to set the value to the default value
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <div className={styles.numberInput}>
            <p>{inputName}</p>
            <label htmlFor={inputId}>
                <button 
                    onClick={() => handleValueChange(-increment)}
                    disabled={value <= min}
                    style={buttonStyleDecrement}
                >{`-${increment}`}</button>
                <button 
                    onClick={() => handleValueChange(-1)}
                    disabled={value <= min}
                    style={buttonStyleDecrement}
                >-1</button>
                <input
                    id={inputId}
                    value={value}
                    type="text"
                    min={min}
                    max={max}
                    readOnly
                />
                <button 
                    onClick={() => handleValueChange(1)}
                    disabled={value >= max}
                    style={buttonStyleIncrement}
                >+1</button>
                <button 
                    onClick={() => handleValueChange(increment)}
                    disabled={value >= max}
                    style={buttonStyleIncrement}
                >{`+${increment}`}</button>
            </label>
        </div>
    )
}