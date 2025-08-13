import { userPreference } from "@/app/userPrefs/userPrefsUtils";
import NumberInput from "../../inputs/NumberInput";
import styles from "../settings.module.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ColorInput from "../../inputs/ColorInput";
import { computeHoverColour, toGrayscale } from "@/app/utils/colors";
import CheckboxInput from "../../inputs/CheckboxInput";
import RadioInput from "../../inputs/RadioInput";
import { LAYOUTS } from "@/app/(withContext)/gameplay/layout/layoutUtils";

type GeneralSettingsPrompt = {
    nextuserPreference: userPreference;
    setNextuserPreference: Dispatch<SetStateAction<userPreference>>;
}

export default function GeneralSettings({ nextuserPreference, setNextuserPreference }: GeneralSettingsPrompt) {
    // manage the color of the demo button in significant action button color controls
    const demoButtonRef = useRef<HTMLButtonElement | null>(null);
    function handleDemoButtonMouseEnter() {
        if (!demoButtonRef.current) {
            return;
        }

        demoButtonRef.current.style.backgroundColor = nextuserPreference.significantButtonHoverColor;
        demoButtonRef.current.style.borderColor = toGrayscale(nextuserPreference.significantButtonHoverColor) < 128 ? "white" : "black";
        demoButtonRef.current.style.color = toGrayscale(nextuserPreference.significantButtonHoverColor) < 128 ? "white" : "black";
    }

    function handleDemoButtonMouseLeave() {
        if (!demoButtonRef.current) {
            return;
        }

        demoButtonRef.current.style.backgroundColor = nextuserPreference.significantButtonColor;
        demoButtonRef.current.style.borderColor = toGrayscale(nextuserPreference.significantButtonColor) < 128 ? "white" : "black";
        demoButtonRef.current.style.color = toGrayscale(nextuserPreference.significantButtonColor) < 128 ? "white" : "black";
    }

    // handles the automatic selection of hover colours based on original colours
    const [isAutoHoverColorSelection, setIsAutoHoverColorSelection] = useState(false);

    function toggleAutoHover(newChecked: boolean) {
        setIsAutoHoverColorSelection(newChecked);
    }

    // handles layout
    const [layoutIndex, setLayoutIndex] = useState(Object.keys(LAYOUTS).indexOf(nextuserPreference.gameplayLayout));

    // in case of a discard, we want to set the layout index to the default option index
    useEffect(()=> {
        setLayoutIndex(Object.keys(LAYOUTS).indexOf(nextuserPreference.gameplayLayout));
    }, [nextuserPreference.gameplayLayout]);
    
    function handleChangeLayout(index: number) {
        setLayoutIndex(index);
        setNextuserPreference({
            ...nextuserPreference,
            gameplayLayout: Object.keys(LAYOUTS)[index],
        });
    }

    return (
        <div
            className={`${styles.settingsOptionDisplay} ${styles.generalSettingsDisplay}`}
        >
            <section className={styles.settingsContentChunk}>
                <NumberInput 
                    inputId="font-size"
                    defaultValue={nextuserPreference.fontSize}
                    min={10}
                    max={32}
                    increment={5}
                    inputName="Font Size (also applicable to code editor)"
                    handleInputChange={option => {
                        setNextuserPreference({
                            ...nextuserPreference,
                            fontSize: option,
                        })
                    }}
                />
            </section>
            <section className={styles.settingsContentChunk}>
                <div className={styles.buttonColorControls}>
                    <div className={styles.significantButtonColor}>
                        <ColorInput 
                            inputId="significant-button-color"
                            defaultValue={nextuserPreference.significantButtonColor}
                            inputName="Main Action Button Color"
                            handleOptionChange={(color: string) => {
                                setNextuserPreference({
                                    ...nextuserPreference,
                                    significantButtonColor: color,
                                    significantButtonHoverColor: 
                                        isAutoHoverColorSelection 
                                        ? computeHoverColour(color) 
                                        : nextuserPreference.significantButtonHoverColor
                                })
                            }}
                        />
                    </div>
                    <div className={styles.significantButtonColorHovered}>
                        <ColorInput 
                            inputId="significant-button-hover-color"
                            defaultValue={nextuserPreference.significantButtonHoverColor}
                            inputName="Main Action Button Color (Hovered)"
                            directInjectionValue={isAutoHoverColorSelection 
                                ? nextuserPreference.significantButtonHoverColor
                                : undefined}
                            handleOptionChange={(color: string) => {
                                setNextuserPreference({
                                    ...nextuserPreference,
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
                            backgroundColor: nextuserPreference.significantButtonColor,
                            borderColor: toGrayscale(nextuserPreference.significantButtonColor) < 128 ? "white" : "black",
                            color: toGrayscale(nextuserPreference.significantButtonColor) < 128 ? "white" : "black",
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
                    - If its value is above 128, the new value is: <code>value - min(floor(0.4 * (value - 128)), 24)</code><br></br><br></br>
                    Note: Change the Main Action Button Color once after ticking this option to see the effect.
                </p>
            </section>
            <section className={styles.settingsContentChunk}>
                <div className={styles.layoutSettings}>
                    <RadioInput
                        inputName="Layout"
                        options={Object.keys(LAYOUTS)}
                        defaultOptionIndex={layoutIndex}
                        handleOptionChosen={handleChangeLayout}
                    />
                    <div style={{
                        width: "100%",
                        height: "100%",
                    }}>
                        {LAYOUTS[Object.keys(LAYOUTS)[layoutIndex]].miniPreview}
                    </div>
                </div>
            </section>
        </div>
    )
}