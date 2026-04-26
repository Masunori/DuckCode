"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./input.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { isKeyCombo } from '@/lib/utils/keyBindings';
import { keyboardManager } from "@/lib/utils/keyboardManager";

type NumberInputProps = {
    inputId: string;
    defaultValue: number;
    min: number;
    max: number;
    increment: number;
    inputName: string;
    handleInputChange: (num: number) => void; 
}

const COMPACT_THRESHOLD_IN_REM = 13;

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
 * @returns The number input component
 */
export default function NumberInput({ inputId, defaultValue, min, max, increment, inputName, handleInputChange }: NumberInputProps) {
    const [value, setValue] = useState(defaultValue);
    const fontSize = useUserPreferenceStore(state => state.userPreference.fontSize);
    
    const labelRef = useRef<HTMLLabelElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const label = labelRef.current;

        if (!label) return;

        const observer = new ResizeObserver(([entry]) => {
            setIsCompact(entry.contentRect.width < COMPACT_THRESHOLD_IN_REM * fontSize);
        });

        observer.observe(label);
        return () => {
            observer.disconnect();
        };
    }, []);

    // typical number input key binding
    // - ArrowUp to increase by 1
    // - ArrowDown to decrease by 1
    // - Shift + ArrowUp to increase by increment
    // - Shift + ArrowDown to decrease by increment
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (document.activeElement !== inputRef.current) return false;

            if (isKeyCombo(e, { ctrl: false, shift: false, key: "ArrowUp" })) {
                e.preventDefault();
                handleValueChange(1);
                return true;
            } else if (isKeyCombo(e, { ctrl: false, shift: false, key: "ArrowDown" })) {
                e.preventDefault();
                handleValueChange(-1);
                return true;
            } else if (isKeyCombo(e, { ctrl: false, shift: true, key: "ArrowUp" })) {
                e.preventDefault();
                handleValueChange(increment);
                return true;
            } else if (isKeyCombo(e, { ctrl: false, shift: true, key: "ArrowDown" })) {
                e.preventDefault();
                handleValueChange(-increment);
                return true;
            }

            return false;
        }

        keyboardManager.register(`numberInput-${inputId}`, "SETTINGS_INPUT_KEY_PRIORITY", handleKeyDown);

        return () => {
            keyboardManager.unregister(`numberInput-${inputId}`);
        }
    }, []);

    function handleValueChange(increment: number) {
        const newValue = Math.max(Math.min(max, value + increment), min); // cap the value between min and max
        setValue(prev => Math.max(Math.min(max, prev + increment), min));
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
        <div 
            className={styles.numberInput}
        >
            <p>{inputName}</p>
            <label 
                htmlFor={inputId} 
                className={isCompact ? styles.compact : ""}
                ref={labelRef}
            >
                {
                    (!isCompact) && <>
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
                    </>
                }
                <input
                    id={inputId}
                    value={value}
                    type="text"
                    min={min}
                    max={max}
                    readOnly
                    ref={inputRef} 
                />
                {
                    (!isCompact) && <>
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
                    </>
                }
                {
                    (isCompact) && <div className={styles.compactControls}>
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
                    </div>
                }
            </label>
        </div>
    )
}