"use client";

import { toGrayscale } from "@/lib/utils/colors";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./input.module.css";

type ColorInputProps = {
    inputName: string;
    inputId: string;
    defaultValue: string;
    handleOptionChange: (option: string) => void;
    directInjectionValue?: string
}

/**
 * Renders a color input.
 * 
 * @param param0 The props
 * - `inputName (string)`: the description for the input
 * - `inputId (string)`: the ColorInput contains a label and an input, use this value to set label's htmlFor and input's id attributes
 * - `defaultValue (string)`: the default color value as a hexadecimal RGB color string (`#123456`)
 * - `handleOptionChange (string => void)`: the function that will be executed upon a change of colour
 * - `directInjectionValue? (string)`: if set, you directly inject a color value to the color input display, and the color input is fixed
 * @returns 
 */
export default function ColorInput({ inputName, inputId, defaultValue, handleOptionChange, directInjectionValue }: ColorInputProps) {
    const [color, setColor] = useState(defaultValue);

    function handleColorChange(e: ChangeEvent) {
        const newColor = (e.target as HTMLInputElement).value;
        setColor(newColor);
        handleOptionChange(color);
    }

    // in case of a discard, we want to set the color to the default value
    useEffect(() => {
        setColor(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        if (directInjectionValue) {
            setColor(directInjectionValue);
        }
    }, [directInjectionValue]);

    return (
        <div className={styles.colorInput}>
            <p>{inputName}</p>
            <label htmlFor={inputId}>
                <input
                    id={inputId}
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                ></input>
                <div
                    className={styles.falseSwatch}
                    style={{
                        backgroundColor: color,
                        color: toGrayscale(color) < 128 ? "white" : "black",
                        borderColor: toGrayscale(color) < 128 ? "white" : "black",
                    }}
                >
                    {color}
                </div>
            </label>
        </div>
    )
}