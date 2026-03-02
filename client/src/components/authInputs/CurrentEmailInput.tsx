import { useState } from "react";
import styles from './authInputs.module.css';

type CurrentEmailInputProps = {
    onChangeCurrentEmail: (currentEmail: string) => void;
}

/**
 * The CurrentEmailInput component provides a user interface for entering the user's current email. It includes an input field for the current email, along with validation and a tooltip guide for email requirements.
 * @param param0 An object containing:
 * - onChangeCurrentEmail: A callback function that is called when the current email input value changes, receiving the current email as an argument.
 * @returns 
 */
export default function CurrentEmailInput({
    onChangeCurrentEmail
}: CurrentEmailInputProps) {
    return <>
        Email
        <label htmlFor="login-email" className={styles.authInputLabel}>
            <input
                id="login-email"
                type="email"
                required
                onChange={(e) => {
                    onChangeCurrentEmail(e.target.value);
                }}
            />
        </label>
    </>;
}