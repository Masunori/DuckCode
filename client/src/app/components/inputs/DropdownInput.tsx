"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./input.module.css";

type DropdownInputProps = {
    dropdownName: string;
    options: string[];
    inputId: string;
    defaultOption: string;
    handleOptionChange: (option: string) => void; 
}

/**
 * Renders a dropdown input.
 * 
 * @param param0 the props:
 * - `options (string[])`: the list of options to choose from the dropdown
 * - `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
 * - `defaultOption (string)`: the default option, note that the user has to ensure this value is within options
 * - `dropdownName (string)`: the text to describe the dropdown
 * - `handleOptionChange (string => void)`: the function that is applied on the new selected option
 * @returns 
 */
export default function DropdownInput({ options, inputId, defaultOption, dropdownName, handleOptionChange }: DropdownInputProps) {
    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null); 
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setSelectedOption(defaultOption);
    }, [defaultOption]);

    /*
        Note to future me:
        - When a dropdown option is clicked, it programmatically changes the input value and causes onClick to fire.
        - Thus, I let the input's onClick to toggle, so that when I click on a dropdown item, this closes the list.
        - The workflow is that:
            1. The user clicks on the input: dropdown opens
            2. The user clicks on a dropdown option: dropdown closes
    */
    function handleClick(index: number) {
        setSelectedOption(options[index]);
        handleOptionChange(options[index]);
    }

    // in case of a discard, we want to set the selected option to the default option
    useEffect(() => {
        if (defaultOption && options.includes(defaultOption)) {
            setSelectedOption(defaultOption);
        }
    }, [defaultOption, options]);

    useEffect(() => {
        function closeDropdown(e: MouseEvent) {
            if (!dropdownRef.current) {
                return;
            }

            /*
            // if the user clicks on a dropdown option, it is intuitive for the list to close
            const isDropdownOptionClicked = dropdownRef.current.contains(e.target as HTMLLIElement);

            // if the user clicks on the dropdown, but not on an option (like clicking on the input), the dropdown list should not close
            const isDropdownButNotOptionClicked = dropdownRef.current.contains(e.target as HTMLElement);
            */
            if (!dropdownRef.current.contains(e.target as HTMLElement)) {
                setIsDropdownVisible(false);
            }
        }

        window.addEventListener("click", closeDropdown);
        return () => {
            window.removeEventListener("click", closeDropdown);
        }
    }, []);

    return (
        <div 
            className={styles.dropdownInput}
            ref={dropdownRef}
        >
            <p>{dropdownName}</p>
            <label htmlFor={inputId}>
                <input 
                    id={inputId}
                    ref={inputRef}
                    type="text"
                    value={selectedOption}
                    onClick={() => setIsDropdownVisible(prev => !prev)}
                    readOnly
                />
                <ul 
                    style={{
                        height: isDropdownVisible ? "10em" : 0,
                        overflowY: isDropdownVisible ? "auto" : "hidden"
                    }}
                >
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleClick(index)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </label>
        </div>
        
    )
}