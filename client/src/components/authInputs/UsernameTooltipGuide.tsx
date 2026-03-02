import { FieldState, USERNAME_CONDITIONS } from "@/lib/utils/fieldConditions";
import { AnimatePresence, motion } from "motion/react";
import styles from './authInputs.module.css';
import { fieldBorderColors, InputIndicatorColours } from "../themes/authColors";


const getIndicator = (fieldState: FieldState) => {
    switch (fieldState) {
        case FieldState.EMPTY:
            return "";
        case FieldState.VALID:
            return "✔ ";
        case FieldState.INVALID:
        case FieldState.SERVER_SIDE_INVALID:
            return "✖ ";
    }
}

/**
 * Tooltip guide for username input field, showing username requirements.
 * 
 * @param param0 An object containing:
 * - isFocused: A boolean indicating whether the username input field is currently focused, which controls the visibility of the tooltip.
 * @returns the UsernameGuideTooltip component, which conditionally renders a list of username requirements with animation when the (username) input field is focused.
 */
export default function UsernameGuideTooltip({ validationResults, isFocused }: {
    validationResults: Record<string, FieldState>;
    isFocused: boolean;
}) {
    return <AnimatePresence>
        {isFocused && <motion.ul
            initial={{ height: 0, opacity: 0, overflow: "hidden", padding: 0 }}
            animate={{ height: "auto", opacity: 1, paddingBottom: "0.5rem", overflow: "hidden" }}
            exit={{ height: 0, opacity: 0, padding: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.tooltip}
            style={{
                color: InputIndicatorColours.EMPTY_STRING_BORDER,
            }}
        >
            {Object.entries(USERNAME_CONDITIONS).map(([key, value]) => (
                <li
                    key={key}
                    style={{
                        color: fieldBorderColors[validationResults[key]]
                    }}
                >
                    {getIndicator(validationResults[key])}{value.name}
                </li>
            ))}
        </motion.ul>}
    </AnimatePresence>
}