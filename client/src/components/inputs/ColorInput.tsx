"use client";

import { useDebouncedSave } from "@/hooks/useDebounce";
import { toGrayscale } from "@/lib/utils/colors";
import { printd } from "@/lib/utils/debugUtils";
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
    const [isDisabled, setDisabled] = useState(false);

    printd("@/components/inputs/ColorInput", `Rendering ColorInput (${inputName}) with color:`, color, "and isDisabled:", isDisabled);

    const { debouncedSave } = useDebouncedSave((color: string) => {
        handleOptionChange(color);
    }, 300);

    function handleColorChange(e: ChangeEvent) {
        const newColor = (e.target as HTMLInputElement).value;
        setColor(newColor);
        debouncedSave(newColor);
    }

    // in case of a discard, we want to set the color to the default value
    useEffect(() => {
        setColor(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        if (directInjectionValue) {
            setColor(directInjectionValue);
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [directInjectionValue]);

    return (
        <div
            className={styles.colorInput}
        >
            <p>{inputName} {isDisabled && <span style={{fontSize: "0.8rem", opacity: 0.5}}>(Auto)</span>}</p>
            <label
                htmlFor={inputId}
                style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.6 : 1,
                }}
            >
                <input
                    id={inputId}
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    disabled={isDisabled}
                    style={{
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.6 : 1,
                    }}
                />
                <div
                    className={styles.falseSwatch}
                    style={{
                        backgroundColor: color,
                        color: toGrayscale(color) < 128 ? "white" : "black",
                        borderColor: toGrayscale(color) < 128 ? "white" : "black",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    {color}
                </div>
            </label>
        </div>
    )
}