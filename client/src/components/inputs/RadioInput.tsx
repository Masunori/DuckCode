"use client"

import { useEffect, useRef, useState } from "react";
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
    const containerRef = useRef<HTMLDivElement | null>(null);

    function handleClick(index: number) {
        // Save the scroll position of the nearest scrollable ancestor before
        // the state update, then restore it after render to prevent scroll jumps.
        const scrollParent = containerRef.current?.closest("[class*='settingsOptionDisplay']") as HTMLElement | null;
        const savedScroll = scrollParent?.scrollTop;

        setSelectedIndex(index);
        handleOptionChosen(index);

        // `handleClick` calls `setSelectedIndex`, which triggers a React re-render. 
        // During that re-render, the scale style on the radio dot changes, and some browsers will 
        // scroll the changed element into view (especially when the parent container is scrollable)
        // This causes a scroll jump whenever the user clicks on a radio option that is outside the current viewport of the scrollable container.
        
        // Restore the scroll position after the state update and re-render.
        if (scrollParent && savedScroll !== undefined) {
            requestAnimationFrame(() => {
                scrollParent.scrollTop = savedScroll;
            });
        }
    };

    // in case of a discard, we want to set the selected index to the default option index
    useEffect(() => {
        setSelectedIndex(defaultOptionIndex);
    }, [defaultOptionIndex]);

    return (
        <div className={styles.radioInputs} ref={containerRef}>
            <h3><b>{inputName}</b></h3>
            <ul>
                {options.map((option, index) => (
                    <li key={index} onClick={() => handleClick(index)} onMouseDown={e => e.preventDefault()}>
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