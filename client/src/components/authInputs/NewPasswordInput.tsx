import { FieldState, PASSWORD_CONDITIONS } from "@/lib/utils/fieldConditions";
import { CSSProperties, useRef, useState } from "react";
import { fieldBorderColors, InputIndicatorColours } from "../themes/authColors";
import styles from './authInputs.module.css';
import PasswordGuideTooltip from "./PasswordTooltipGuide";

type NewPasswordInputProps = {
    onChangeNewPassword: (newPassword: string) => void;
    onChangeConfirmPassword: (confirmPassword: string) => void;
    onValidateNewPassword: (fieldState: FieldState) => void;
    onValidateConfirmPassword: (fieldState: FieldState) => void;
}

/**
 * Validates the new password against the defined password conditions.
 * @param password The new password to validate.
 * @returns An object mapping each password condition to its validation state (empty, valid, invalid).
 */
function validatePasswordConditions(password: string): Record<string, FieldState> {
    const result: Record<string, FieldState> = {};

    Object.entries(PASSWORD_CONDITIONS).forEach((condition, index) => {
        const name = condition[0];
        const checkFn = condition[1].checkFn;

        if (password === "") {
            result[name] = FieldState.EMPTY;
        } else if (!checkFn(password)) {
            result[name] = FieldState.INVALID;
        } else {
            result[name] = FieldState.VALID;
        }
    });

    return result;
}

/**
 * Gets the overall field state for the new password input based on the validation results of individual password conditions. The field state is determined as follows:
 * - If the password is an empty string, the field state is EMPTY.
 * - If any of the password conditions are invalid, the field state is INVALID.
 * - If all password conditions are valid, the field state is VALID.
 * @param password The new password to evaluate.
 * @returns The overall field state for the new password input.
 */
function getPasswordFieldState(
    password: string,
): FieldState {
    const validationResults = validatePasswordConditions(password);

    return password === ""
        ? FieldState.EMPTY
        : Object.values(validationResults).includes(FieldState.INVALID)
            ? FieldState.INVALID
            : FieldState.VALID;
}

/**
 * Gets the field state for the confirm password input based on the current values of the new password and confirm password inputs. The field state is determined as follows:
 * - If the confirm password is empty or shorter than the new password, the field state is EMPTY.
 * - If the confirm password does not match the new password, the field state is INVALID.
 * - If the confirm password matches the new password, the field state is VALID.
 * @param newPassword The value of the new password input.
 * @param confirmPassword The value of the confirm password input.
 * @returns The field state for the confirm password input.
 */
function getConfirmPasswordFieldState(
    newPassword: string,
    confirmPassword: string
): FieldState {
    if (confirmPassword === "" || confirmPassword.length < newPassword.length) {
        return FieldState.EMPTY;
    } else if (confirmPassword !== newPassword) {
        return FieldState.INVALID;
    } else {
        return FieldState.VALID;
    }
}

/**
 * The NewPasswordInput component provides a user interface for entering the user's password. It includes input fields for the new password and confirm new password, along with validation and a tooltip guide for password requirements.
 * @param param0 An object containing:
 * - onChangeNewPassword: A callback function that is called when the new password input value changes, receiving the new password as an argument.
 * - onChangeConfirmPassword: A callback function that is called when the confirm new password input value changes, receiving the confirm password as an argument.
 * - onValidatePassword: A callback function that is called when the new password input value changes, receiving the validation state of the new password as an argument.
 * @returns The NewPasswordInput component.
 */
export default function NewPasswordInput({
    onChangeNewPassword,
    onChangeConfirmPassword,
    onValidateNewPassword,
    onValidateConfirmPassword
}: NewPasswordInputProps) {
    const newPasswordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    // controls the visibility of the password guide tooltip, which is shown when either the new password input or confirm password input is focused - to prevent the tooltip from disappearing when switching between the two inputs, we track focus on both inputs with this single state variable
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // controls the visibility of the password strings in the inputs
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    // refs to the show password buttons
    const newPasswordShowButtonRef = useRef<HTMLButtonElement | null>(null);
    const confirmPasswordShowButtonRef = useRef<HTMLButtonElement | null>(null);

    function getNewPasswordStyle(): CSSProperties {
        const newPassword = newPasswordRef.current?.value || "";
        const fieldState = getPasswordFieldState(newPassword);

        return {
            borderColor: fieldBorderColors[fieldState]
        };
    }

    function getConfirmPasswordStyle(): CSSProperties {
        const confirmPassword = confirmPasswordRef.current?.value || "";
        const newPassword = newPasswordRef.current?.value || "";

        const fieldState = getConfirmPasswordFieldState(newPassword, confirmPassword);

        return {
            borderColor: fieldBorderColors[fieldState]
        };
    }

    return <>
        <>
            New Password
            <label className={styles.authInputLabel}>
                <input
                    type={isNewPasswordVisible ? "text" : "password"}
                    ref={newPasswordRef}
                    style={getNewPasswordStyle()}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChangeNewPassword(value);
                        onValidateNewPassword(getPasswordFieldState(value));
                    }}
                    autoComplete="new-password"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={(e) => {
                        // focusing on these buttons shouldn't close the password guide tooltip
                        const focusingButton =
                            e.relatedTarget === newPasswordShowButtonRef.current ||
                            e.relatedTarget === confirmPasswordShowButtonRef.current;

                        setIsPasswordFocused(focusingButton);
                    }}
                />
                <button
                    onClick={() => setIsNewPasswordVisible(prev => !prev)}
                    // prevent the input from losing focus when clicking the show/hide button, which would cause the password guide tooltip to disappear
                    onMouseDown={(e) => e.preventDefault()}
                    ref={newPasswordShowButtonRef}
                    className={styles.showPasswordButton}
                    type="button"
                >
                    {isNewPasswordVisible ? "Hide" : "Show"}
                </button>
            </label>
            <PasswordGuideTooltip 
                validationResults={validatePasswordConditions(newPasswordRef.current?.value || "")} 
                isFocused={isPasswordFocused} 
            />
        </>
        <>
            Confirm New Password
            <label className={styles.authInputLabel}>
                <input
                    type={isNewPasswordVisible ? "text" : "password"}
                    ref={confirmPasswordRef}
                    style={getConfirmPasswordStyle()}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChangeConfirmPassword(value);
                        onValidateConfirmPassword(getConfirmPasswordFieldState(newPasswordRef.current?.value || "", value));
                    }}
                    autoComplete="new-password"
                />
                <button
                    onClick={() => setIsNewPasswordVisible(prev => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    ref={confirmPasswordShowButtonRef}
                    className={styles.showPasswordButton}
                    type="button"
                >
                    {isNewPasswordVisible ? "Hide" : "Show"}
                </button>
            </label>
        </>
    </>;
}