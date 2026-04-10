import { useEffect, useRef, useState } from "react";
import styles from "./input.module.css";
import { s } from "motion/react-client";

type OTPInputProps = {
    n: number;
    onOtpChange: (otp: string) => void;
    onOtpValidate: (isValid: boolean) => void;
};

/**
 * A component for inputting a one-time password (OTP) with a specified number of digits.
 * @param param0 An object containing the following properties:
 * - `n (number)`: the number of digits in the OTP, must be a positive integer
 * - `onOtpChange (function)`: a callback function that is called when the OTP changes, with the new OTP as its argument
 * - `onOtpValidate (function)`: a callback function that is called when the OTP is validated, with a boolean indicating whether the OTP is valid as its argument
 * @returns The OTP input component
 */
export default function OTPInput({ n, onOtpChange, onOtpValidate }: OTPInputProps) {
    const [digits, setDigits] = useState<string[]>(Array(n).fill(''));
    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Notify parent component of OTP changes and validity whenever digits change
    useEffect(() => {
        const otp = digits.join('');
        onOtpChange(otp);
        onOtpValidate(otp.length === n && /^\d+$/.test(otp));
    }, [digits]);

    const focusIndex = (index: number) => {
        const clampedIndex = Math.max(0, Math.min(n - 1, index));
        inputRefs.current[clampedIndex]?.focus();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();

            if (digits[index]) {
                // Clear current digit if it exists
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
            } else {
                // Clear previous digit if current is empty
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                setDigits(newDigits);
                focusIndex(index - 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusIndex(index - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusIndex(index + 1);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        
        if (!/^\d?$/.test(value)) {
            // Only allow a single digit (0-9)
            return;
        }

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        focusIndex(index + 1);
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
        
        const newDigits = Array(n).fill('');
        for (let i = 0; i < Math.min(pasteData.length, n); i++) {
            newDigits[i] = pasteData[i];
        }

        const lastFilledIndex = Math.min(pasteData.length, n) - 1;
        setDigits(newDigits);
        focusIndex(lastFilledIndex);
    }

    return <div className={styles.otpInputContainer}>
        {digits.map((digit, index) => (
            <input
                className={styles.otpDigitInput}
                key={index}
                ref={(el) => { 
                    if (el) {
                        inputRefs.current[index] = el;
                    }
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
            />
        ))}
    </div>;
}