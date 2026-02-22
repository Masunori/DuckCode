import { FieldState, USERNAME_CONDITIONS } from "@/lib/utils/fieldConditions";
import { CSSProperties, useRef, useState } from "react";
import { fieldBorderColors } from "../themes/authColors";
import styles from './authInputs.module.css';
import UsernameTooltipGuide from "./UsernameTooltipGuide";

type NewUsernameInputProps = {
    onChangeNewUsername: (newUsername: string) => void;
    onValidateNewUsername: (fieldState: FieldState) => void;
}

/**
 * Validates the new username against the defined username conditions.
 * @param username The new username to validate.
 * @returns An object mapping each username condition to its validation state (empty, valid, invalid).
 */
function validateUsernameConditions(username: string): Record<string, FieldState> {
    const result: Record<string, FieldState> = {};

    Object.entries(USERNAME_CONDITIONS).forEach((condition, index) => {
        const name = condition[0];
        const checkFn = condition[1].checkFn;

        if (username === "") {
            result[name] = FieldState.EMPTY;
        } else if (!checkFn(username)) {
            result[name] = FieldState.INVALID;
        } else {
            result[name] = FieldState.VALID;
        }
    });

    return result;
}

/**
 * Gets the overall field state for the new username input based on the validation results of individual username conditions. The field state is determined as follows:
 * - If the username is an empty string, the field state is EMPTY.
 * - If any of the username conditions are invalid, the field state is INVALID.
 * - If all username conditions are valid, the field state is VALID.
 * @param username The new username to evaluate.
 * @returns The overall field state for the new username input.
 */
function getUsernameFieldState(
    username: string,
): FieldState {
    const validationResults = validateUsernameConditions(username);

    return username === ""
        ? FieldState.EMPTY
        : Object.values(validationResults).includes(FieldState.INVALID)
            ? FieldState.INVALID
            : FieldState.VALID;
}

/**
 * The NewUsernameInput component provides a user interface for entering the user's new username. It includes an input field for the new username, along with validation and a tooltip guide for username requirements.
 * 
 * @param param0 An object containing:
 * - onChangeNewUsername: A callback function that is called when the new username input value changes, receiving the new username as an argument.
 * @returns the NewUsernameInput component
 */
export default function NewUsernameInput({
    onChangeNewUsername,
    onValidateNewUsername
}: NewUsernameInputProps) {
    const newUsernameRef = useRef<HTMLInputElement | null>(null);

    // controls the visibility of the username guide tooltip, which is shown when either the new username input is focused
    const [isNewUsernameFocused, setIsNewUsernameFocused] = useState(false);

    function getNewUsernameStyle(): CSSProperties {
        const newUsername = newUsernameRef.current?.value || "";
        const fieldState = getUsernameFieldState(newUsername);

        return {
            borderColor: fieldBorderColors[fieldState]
        }
    }

    return <>
        <>
            Username
            <label htmlFor="username" className={styles.authInputLabel}>
                <input
                    type="text"
                    id="username"
                    ref={newUsernameRef}
                    style={getNewUsernameStyle()}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChangeNewUsername(value);
                        onValidateNewUsername(getUsernameFieldState(value));
                    }}
                    onFocus={() => setIsNewUsernameFocused(true)}
                    onBlur={() => setIsNewUsernameFocused(false)}
                />
            </label>
            <UsernameTooltipGuide 
                validationResults={validateUsernameConditions(newUsernameRef.current?.value ?? "")} 
                isFocused={isNewUsernameFocused} 
            />
        </>
    </>;
}