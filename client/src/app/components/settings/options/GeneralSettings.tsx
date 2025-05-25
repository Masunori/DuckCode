import { UserPreference } from "@/app/userPrefs/userPrefsUtils";
import NumberInput from "../../inputs/NumberInput";
import styles from "../settings.module.css";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import ColorInput from "../../inputs/ColorInput";
import { computeHoverColour, toGrayscale } from "@/app/utils/colors";
import CheckboxInput from "../../inputs/CheckboxInput";
// import RadioInput from "../../inputs/RadioInput";

type GeneralSettingsPrompt = {
    nextUserPreference: UserPreference;
    setNextUserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function GeneralSettings({ nextUserPreference, setNextUserPreference }: GeneralSettingsPrompt) {
    // manage the color of the demo button in significant action button color controls
    const demoButtonRef = useRef<HTMLButtonElement | null>(null);
    function handleDemoButtonMouseEnter() {
        if (!demoButtonRef.current) {
            return;
        }

        demoButtonRef.current.style.backgroundColor = nextUserPreference.significantButtonHoverColor;
        demoButtonRef.current.style.borderColor = toGrayscale(nextUserPreference.significantButtonHoverColor) < 128 ? "white" : "black";
        demoButtonRef.current.style.color = toGrayscale(nextUserPreference.significantButtonHoverColor) < 128 ? "white" : "black";
    }

    function handleDemoButtonMouseLeave() {
        if (!demoButtonRef.current) {
            return;
        }

        demoButtonRef.current.style.backgroundColor = nextUserPreference.significantButtonColor;
        demoButtonRef.current.style.borderColor = toGrayscale(nextUserPreference.significantButtonColor) < 128 ? "white" : "black";
        demoButtonRef.current.style.color = toGrayscale(nextUserPreference.significantButtonColor) < 128 ? "white" : "black";
    }

    // handles the automatic selection of hover colours based on original colours
    const [isAutoHoverColorSelection, setIsAutoHoverColorSelection] = useState(false);

    function toggleAutoHover(newChecked: boolean) {
        setIsAutoHoverColorSelection(newChecked);
    }

    // handles layout

    return (
        <div
            className={`${styles.settingsOptionDisplay} ${styles.generalSettingsDisplay}`}
        >
            <div className={styles.settingsContentChunk}>
                <NumberInput 
                    inputId="font-size"
                    defaultValue={nextUserPreference.fontSize}
                    min={10}
                    max={32}
                    increment={5}
                    inputName="Font Size (also applicable to code editor)"
                    handleInputChange={option => {
                        setNextUserPreference({
                            ...nextUserPreference,
                            fontSize: option,
                        })
                    }}
                />
            </div>
            <div className={styles.settingsContentChunk}>
                <div className={styles.buttonColorControls}>
                    <div className={styles.significantButtonColor}>
                        <ColorInput 
                            inputId="significant-button-color"
                            defaultValue={nextUserPreference.significantButtonColor}
                            inputName="Main Action Button Color"
                            handleOptionChange={(color: string) => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    significantButtonColor: color,
                                    significantButtonHoverColor: 
                                        isAutoHoverColorSelection 
                                        ? computeHoverColour(color) 
                                        : nextUserPreference.significantButtonHoverColor
                                })
                            }}
                        />
                    </div>
                    <div className={styles.significantButtonColorHovered}>
                        <ColorInput 
                            inputId="significant-button-hover-color"
                            defaultValue={nextUserPreference.significantButtonHoverColor}
                            inputName="Main Action Button Color (Hovered)"
                            directInjectionValue={isAutoHoverColorSelection 
                                ? nextUserPreference.significantButtonHoverColor
                                : undefined}
                            handleOptionChange={(color: string) => {
                                setNextUserPreference({
                                    ...nextUserPreference,
                                    significantButtonHoverColor: color,
                                })
                            }}
                        />
                    </div>
                    <button
                        ref={demoButtonRef}
                        onMouseEnter={handleDemoButtonMouseEnter}
                        onMouseLeave={handleDemoButtonMouseLeave}
                        style={{
                            backgroundColor: nextUserPreference.significantButtonColor,
                            borderColor: toGrayscale(nextUserPreference.significantButtonColor) < 128 ? "white" : "black",
                            color: toGrayscale(nextUserPreference.significantButtonColor) < 128 ? "white" : "black",
                        }}
                    >Live preview. Hover me!</button>
                    <div className={styles.autoSelectHoverColor}>
                        <CheckboxInput 
                            inputId="auto-select-hover-color"
                            inputName="Automatically select hover color"
                            defaultChecked={isAutoHoverColorSelection}
                            handleOptionChange={toggleAutoHover}
                        />
                    </div>
                </div>
                <p className={styles.autoHoverSelectorExplanation}>
                    The automatic selection of hover color is selected in a way that for each red, green and blue component,<br></br>
                    - If its value is below 128, the new value is: <code>value + min(floor(0.4 * (128 - value)), 24)</code><br></br>
                    - If its value is above 128, the new value is: <code>value - min(floor(0.4 * (value - 128)), 24)</code>
                </p>
            </div>
            <div className={styles.settingsContentChunk}>
                {/* <RadioInput
                    inputName="Layout"
                    options={["One", "Two"]}
                    defaultOptionIndex={0}
                    handleOptionChosen={index => {}}
                /> */}
            </div>
        </div>
    )
}