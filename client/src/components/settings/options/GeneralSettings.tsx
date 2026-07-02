import { UserPreference } from "@/app/userPrefs/userPrefsTypes";
import { LAYOUTS } from "@/components/gameplay/layout/layoutUtils";
import ColorInput from "@/components/inputs/ColorInput";
import DropdownInput from "@/components/inputs/DropdownInput";
import NumberInput from "@/components/inputs/NumberInput";
import RadioInput from "@/components/inputs/RadioInput";
import styles from "@/components/settings/settings.module.css";
import { COLOR_ACCESSIBILITY_PALETTES, ColorAccessibilityKeyword } from "@/components/themes/colorAccessibilityPalettes";
import { toGrayscale } from "@/utils/colors";
import { printd } from "@/utils/debugUtils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type GeneralSettingsPrompt = {
    nextuserPreference: UserPreference;
    setNextuserPreference: Dispatch<SetStateAction<UserPreference>>;
}

export default function GeneralSettings({ nextuserPreference: nextUserPreference, setNextuserPreference }: GeneralSettingsPrompt) {
    // manage the color of the demo button in significant action button color controls
    const palette = COLOR_ACCESSIBILITY_PALETTES[nextUserPreference.colorAccessibilityMode];

    printd("@/components/settings/options/GeneralSettings", "Rendering GeneralSettings with nextUserPreference:", nextUserPreference);

    // handles layout
    const [layoutIndex, setLayoutIndex] = useState(Object.keys(LAYOUTS).indexOf(nextUserPreference.gameplayLayout));
    const [colorAccessibilityIndex, setColorAccessibilityIndex] = useState(Object.keys(COLOR_ACCESSIBILITY_PALETTES).indexOf(nextUserPreference.colorAccessibilityMode));

    // in case of a discard, we want to set the layout index to the default option index
    useEffect(() => {
        setLayoutIndex(Object.keys(LAYOUTS).indexOf(nextUserPreference.gameplayLayout));
    }, [nextUserPreference.gameplayLayout]);

    function handleChangeLayout(index: number) {
        setLayoutIndex(index);
        setNextuserPreference(prev => ({
            ...prev,
            gameplayLayout: Object.keys(LAYOUTS)[index],
        }));
    }

    function handleChangeColorAccessibility(index: number) {
        setColorAccessibilityIndex(index);
        setNextuserPreference(prev => ({
            ...prev,
            colorAccessibilityMode: Object.keys(COLOR_ACCESSIBILITY_PALETTES)[index] as ColorAccessibilityKeyword,
        }));
    }

    return (
        <div
            className={`${styles.settingsOptionDisplay} ${styles.generalSettingsDisplay}`}
        >
            <section className={styles.settingsContentChunk}>
                <NumberInput
                    inputId="font-size"
                    defaultValue={nextUserPreference.fontSize}
                    min={10}
                    max={32}
                    increment={5}
                    inputName="Font Size (also applicable to code editor)"
                    handleInputChange={option => {
                        setNextuserPreference(prev => ({
                            ...prev,
                            fontSize: option,
                        }));
                    }}
                />
                <div style={{ margin: "1rem" }}>
                    <p style={{ fontSize: nextUserPreference.fontSize }}>
                        This is a sentence in {nextUserPreference.fontSize}px.
                    </p>
                </div>
            </section>

            <section className={styles.settingsContentChunk}>
                <DropdownInput
                    options={["On", "Off"]}
                    inputId="display-key-binding-on-buttons"
                    defaultOption={nextUserPreference.displayKeyBindingOnButtons ? "On" : "Off"}
                    dropdownName="Show Keyboard Shortcuts on Buttons"
                    handleOptionChange={(option) => {
                        setNextuserPreference(prev => ({
                            ...prev,
                            displayKeyBindingOnButtons: option === "On" ? true : false,
                        }));
                    }}
                />
            </section>

            <section className={styles.settingsContentChunk}>
                <DropdownInput
                    options={["On", "Off"]}
                    inputId="enableEnhancedLanguageSupport"
                    defaultOption={nextUserPreference.enableEnhancedLanguageSupport ? "On" : "Off"}
                    dropdownName="Enable Enhanced Language Support"
                    handleOptionChange={(option) => {
                        setNextuserPreference(prev => ({
                            ...prev,
                            enableEnhancedLanguageSupport: option === "On" ? true : false,
                        }));
                    }}
                />

                <div 
                    className={styles.enhancedLanguageSupportWarning}
                >
                    <p><b>Note</b>: This feature consumes a significant amount of your memory.</p>
                    <p>(This will be dealt with in the future)</p>
                    <br></br>
                    <ul>
                        Currently supported languages:
                        <li>JavaScript</li>
                        <li>Python</li>
                    </ul>
                    <br></br>
                    <p>If you enable or disable this feature, <span>RELOAD THE PAGE</span> for the changes to take effect.</p>
                    
                </div>
            </section>

            <section className={styles.settingsContentChunk}>
                <div className={styles.colorAccessibilitySettings}>
                    <RadioInput
                        inputName="Color Accessibility Mode"
                        options={Object.keys(COLOR_ACCESSIBILITY_PALETTES)}
                        defaultOptionIndex={colorAccessibilityIndex}
                        handleOptionChosen={handleChangeColorAccessibility}
                    />
                    <div style={{ alignSelf: "center" }}>
                        <p><b>{COLOR_ACCESSIBILITY_PALETTES[nextUserPreference.colorAccessibilityMode].description}</b></p>
                        <ul className={styles.colorAccessibilityPaletteColors}>
                            <li>
                                <ColorInput
                                    inputName="Correct Indicator"
                                    inputId="color-accessibility-correct"
                                    defaultValue={palette.correct}
                                    handleOptionChange={() => { }}
                                    directInjectionValue={palette.correct}
                                />
                            </li>
                            <li>
                                <ColorInput
                                    inputName="Correct Indicator (On Hover)"
                                    inputId="color-accessibility-correct-on-hover"
                                    defaultValue={palette.correctOnHover}
                                    handleOptionChange={() => { }}
                                    directInjectionValue={palette.correctOnHover}
                                />
                            </li>
                            <li>
                                <ColorInput
                                    inputName="Wrong Indicator"
                                    inputId="color-accessibility-wrong"
                                    defaultValue={palette.wrong}
                                    handleOptionChange={() => { }}
                                    directInjectionValue={palette.wrong}
                                />
                            </li>
                            <li>
                                <ColorInput
                                    inputName="Wrong Indicator (On Hover)"
                                    inputId="color-accessibility-wrong-on-hover"
                                    defaultValue={palette.wrongOnHover}
                                    handleOptionChange={() => { }}
                                    directInjectionValue={palette.wrongOnHover}
                                />
                            </li>
                        </ul>
                        <div className={styles.colorAccessibilityPalettePreview}>
                            <p><b>Test Case Selector Demonstration</b></p>
                            <ul>
                                <li className={styles.defaultTestCase} >Default Test Case</li>
                                <li
                                    className={styles.correctTestCase}
                                    style={{
                                        backgroundColor: palette.correct,
                                        color: toGrayscale(palette.correct) < 128 ? "var(--font-colour)" : "var(--font-colour-black)"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = palette.correctOnHover;
                                        e.currentTarget.style.color = toGrayscale(palette.correctOnHover) < 128
                                            ? "var(--font-colour)"
                                            : "var(--font-colour-black)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = palette.correct;
                                        e.currentTarget.style.color = toGrayscale(palette.correct) < 128
                                            ? "var(--font-colour)"
                                            : "var(--font-colour-black)";
                                    }}

                                >Correct Test Case</li>
                                <li
                                    className={styles.wrongTestCase}
                                    style={{
                                        backgroundColor: palette.wrong,
                                        color: toGrayscale(palette.wrong) < 128 ? "var(--font-colour)" : "var(--font-colour-black)"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = palette.wrongOnHover;
                                        e.currentTarget.style.color = toGrayscale(palette.wrongOnHover) < 128
                                            ? "var(--font-colour)"
                                            : "var(--font-colour-black)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = palette.wrong;
                                        e.currentTarget.style.color = toGrayscale(palette.wrong) < 128
                                            ? "var(--font-colour)"
                                            : "var(--font-colour-black)";
                                    }}
                                >Wrong Test Case</li>
                            </ul>
                        </div>
                    </div>
                </div>
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
                        display: "flex",
                        alignItems: "center", 
                        overflow: "hidden" 
                    }}>
                        {LAYOUTS[Object.keys(LAYOUTS)[layoutIndex]].miniPreview}
                    </div>
                </div>
            </section>
        </div>
    )
}