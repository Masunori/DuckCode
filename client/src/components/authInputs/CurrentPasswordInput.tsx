import { useState } from "react";
import styles from './authInputs.module.css';

type CurrentPasswordInputProps = {
    onChangeCurrentPassword: (currentPassword: string) => void;
    name?: string;
}

/**
 * The CurrentPasswordInput component provides a user interface for entering the user's current password. It includes an input field for the current password, along with validation and a tooltip guide for password requirements.
 * @param param0 An object containing:
 * - onChangeCurrentPassword: A callback function that is called when the current password input value changes, receiving the current password as an argument.
 * - name: The name of the input field (default is "Password"). Useful when the component is used in contexts where multiple password fields are present, such as in a password change form where both current and new password inputs are rendered.
 * @returns The CurrentPasswordInput component.
 */
export default function CurrentPasswordInput({
    onChangeCurrentPassword,
    name = "Password"
}: CurrentPasswordInputProps) {
    // controls the visibility of the password strings in the inputs
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return <>
        {name}
        <label htmlFor="login-password" className={styles.authInputLabel}>
            <input
                id="login-password"
                type={isPasswordVisible ? "text" : "password"}
                required
                onChange={(e) => {
                    onChangeCurrentPassword(e.target.value);
                }}
            />
            <button 
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setIsPasswordVisible(prev => !prev)}
            >
                {isPasswordVisible ? "Hide" : "Show"}
            </button>
        </label>
    </>;
}