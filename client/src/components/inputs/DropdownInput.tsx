"use client";

import { keyboardManager } from "@/utils/keyboardManager";
import { useEffect, useRef, useState } from "react";
import { isKeyCombo } from '@/utils/keyBindings';
import styles from "./input.module.css";

type DropdownInputProps = {
    /** The text to describe the dropdown */
    dropdownName: string;
    /** The list of options to choose from the dropdown */
    options: string[];
    /** The ID for the input element */
    inputId: string;
    /** The default option for the dropdown */
    defaultOption: string;
    /** The function to call when the option changes */
    handleOptionChange: (option: string) => void;
    /** An optional key binding to toggle the dropdown */
    keyBinding?: { ctrl: boolean, shift: boolean, key: string };
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
export default function DropdownInput({ options, inputId, defaultOption, dropdownName, handleOptionChange, keyBinding }: DropdownInputProps) {
    const [previewOption, setPreviewOption] = useState(defaultOption);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownOptionsRef = useRef<HTMLUListElement | null>(null);

    const selectedOptionRef = useRef(previewOption);

    useEffect(() => {
        setPreviewOption(defaultOption);
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
        setPreviewOption(options[index]);
        handleOptionChange(options[index]);
    }

    // in case of a discard, we want to set the selected option to the default option
    useEffect(() => {
        if (defaultOption && options.includes(defaultOption)) {
            setPreviewOption(defaultOption);
        }
    }, [defaultOption, options]);

    // attach the key binding to toggle the dropdown if exists
    useEffect(() => {
        if (!keyBinding) return;

        const handleToggleDropdown = (e: KeyboardEvent) => {
            if (isKeyCombo(e, keyBinding)) {
                e.preventDefault();

                if (!isDropdownVisible) {
                    setIsDropdownVisible(true);
                    inputRef.current?.focus();
                } else {
                    setIsDropdownVisible(false);
                }

                return true;
            }

            return false;
        }

        keyboardManager.register(`handleToggleDropdown-${inputId}`, "GAMEPLAY_KEY_PRIORITY", handleToggleDropdown);

        return () => {
            keyboardManager.unregister(`handleToggleDropdown-${inputId}`);
        }
    });

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

    // typical dropdown input effects:
    // - arrow up: shift to the option above
    // - arrow down: shift to the option below
    // - enter: select option
    // - escape: escape from the dropdown
    // - tab (and shift + tab): also escape from the dropdown, since the user is trying to shift focus away
    useEffect(() => {
        const handleSelectOption = (e: KeyboardEvent) => {
            if (!inputRef.current || document.activeElement !== inputRef.current) {
                return false;
            }

            // if (!isDropdownVisible || !dropdownOptionsRef.current || !inputRef.current || !selectedOptionRef.current) {
            //     return false;
            // }

            if (isKeyCombo(e, { ctrl: false, shift: false, key: "ArrowDown" })) {
                e.preventDefault();

                if (!isDropdownVisible) {
                    return false;
                }

                const currentIndex = options.indexOf(previewOption);
                const nextIndex = (currentIndex + 1) % options.length;
                setPreviewOption(options[nextIndex]);

                // Scroll the selected <li> into view
                const ul = dropdownOptionsRef.current;
                if (ul) {
                    const li = ul.children[nextIndex] as HTMLElement;
                    if (li) {
                        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                }

                return true;
            } else if (isKeyCombo(e, { ctrl: false, shift: false, key: "ArrowUp" })) {
                e.preventDefault();

                if (!isDropdownVisible) {
                    return false;
                }

                const currentIndex = options.indexOf(previewOption);
                const prevIndex = (currentIndex - 1 + options.length) % options.length;
                setPreviewOption(options[prevIndex]);

                // Scroll the selected <li> into view
                const ul = dropdownOptionsRef.current;
                if (ul) {
                    const li = ul.children[prevIndex] as HTMLElement;
                    if (li) {
                        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                }

                return true;
            } else if (isKeyCombo(e, { ctrl: false, shift: false, key: "Enter" })) {
                e.preventDefault();

                if (!isDropdownVisible) {
                    setIsDropdownVisible(true);
                    return true;
                } else {
                    handleOptionChange(previewOption);
                    setIsDropdownVisible(false);
                    selectedOptionRef.current = previewOption;
                    return true;
                }
            } else if (isKeyCombo(e, { ctrl: false, shift: false, key: "Escape" })) {
                e.preventDefault();
                setIsDropdownVisible(false);
                setPreviewOption(selectedOptionRef.current);
                return true;
            } else if (
                isKeyCombo(e, { ctrl: false, shift: false, key: "Tab" })
                || isKeyCombo(e, { ctrl: false, shift: true, key: "Tab" })
            ) {
                setIsDropdownVisible(false);
                setPreviewOption(selectedOptionRef.current);
                return true;
            }

            return false
        }

        keyboardManager.register(`handleSelectOption-${inputId}`, "SETTINGS_INPUT_KEY_PRIORITY", handleSelectOption);

        return () => {
            keyboardManager.unregister(`handleSelectOption-${inputId}`);
        }
    }, [isDropdownVisible, previewOption, options]);


    // when the dropdown is first opened, the preview option should automatically be scrolled into view
    useEffect(() => {
        const ul = dropdownOptionsRef.current;
        if (ul) {
            const li = ul.children[options.indexOf(previewOption)] as HTMLElement;
            if (li) {
                li.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }, [options, previewOption]);

    return (
        <div
            className={`${styles.dropdownInput} ${isDropdownVisible ? ` ${styles.dropdownInputOpen}` : ""}`}
            ref={dropdownRef}
        >
            <p>{dropdownName}</p>
            <label htmlFor={inputId}>
                <input
                    id={inputId}
                    ref={inputRef}
                    type="text"
                    value={previewOption}
                    onClick={() => setIsDropdownVisible(prev => !prev)}
                    readOnly
                />
                <ul
                    ref={dropdownOptionsRef}
                    style={{
                        height: isDropdownVisible ? "10em" : 0,
                        overflowY: isDropdownVisible ? "auto" : "hidden"
                    }}
                >
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleClick(index)}
                            className={previewOption === option ? styles.selected : ""}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </label>
        </div>

    )
}