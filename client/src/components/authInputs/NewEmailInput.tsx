import { FieldState, USERNAME_CONDITIONS } from "@/lib/utils/fieldConditions";
import { CSSProperties, useRef, useState } from "react";
import { fieldBorderColors } from "../themes/authColors";
import styles from './authInputs.module.css';

type NewEmailInputProps = {
    onChangeNewEmail: (newEmail: string) => void;
    onValidateNewEmail: (fieldState: FieldState) => void;
}

/**
 * Validates the new email against the defined email conditions.
 * @param email The new email to validate.
 * @returns An object mapping each email condition to its validation state (empty, valid, invalid).
 */
function validateEmailCondition(email: string): FieldState {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

    return email === ""
        ? FieldState.EMPTY
        : emailRegex.test(email)
            ? FieldState.VALID
            : FieldState.INVALID;
}

/**
 * The NewEmailInput component provides a user interface for entering the user's new email. It includes an input field for the new email, along with validation and a tooltip guide for email requirements.
 * 
 * @param param0 An object containing:
 * - onChangeNewEmail: A callback function that is called when the new email input value changes, receiving the new email as an argument.
 * - onValidateNewEmail: A callback function that is called when the new email input value changes, receiving the validation state of the new email as an argument.
 * @returns the NewEmailInput component
 */
export default function NewEmailInput({
    onChangeNewEmail,
    onValidateNewEmail
}: NewEmailInputProps) {
    const newEmailRef = useRef<HTMLInputElement>(null);

    function getNewEmailStyle(): CSSProperties {
        const newEmail = newEmailRef.current?.value || "";
        const fieldState = validateEmailCondition(newEmail);

        return {
            borderColor: fieldBorderColors[fieldState]
        }
    }

    return <>
        <>
            Email
            <label htmlFor="email" className={styles.authInputLabel}>
                <input
                    type="email"
                    id="email"
                    ref={newEmailRef}
                    style={getNewEmailStyle()}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChangeNewEmail(value);
                        onValidateNewEmail(validateEmailCondition(value));
                    }}
                />
            </label>
        </>
    </>;
}