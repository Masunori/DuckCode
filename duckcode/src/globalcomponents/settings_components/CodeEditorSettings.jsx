import { useState, useContext, useCallback } from "react";
import { /* CheckboxInput, ColorInput, */ DropdownInput, RadioInput } from "../utility_components/Input";
// import HoverableContent from "../HoverableContent";
import { /* FONT_STYLES, */ PROGRAMMING_LANGUAGES, FONT_FAMILIES } from "../constants";
import { presetThemes, /* customThemeSyntaxHighlight, customComponentColorScheme, */THEME_MODES, /* EditorThemeObject */ } from "../color_schemes/themes";
import { SettingsContext } from "../../App";

function ProgLangOptions() {
    const {settings, modifySettings} = useContext(SettingsContext);
    return (
        <DropdownInput 
            optionsMap={PROGRAMMING_LANGUAGES}
            title="Programming Languages"
            defaultValue={settings.progLang.formal_name}
            getKey={([key, value]) => value.formal_name}
            getValue={([key, value]) => key}
            getAuxiliaryInfo={([key, value]) => value.version}
            onSelectDropDownItem={val => modifySettings('progLang', PROGRAMMING_LANGUAGES[val])}
        />
    )
}

function CodeFontOptions() {
    const {modifySettings} = useContext(SettingsContext);
    return (
        <DropdownInput
            optionsMap={FONT_FAMILIES}
            getKey={([key, value]) => value.formal_name}
            getValue={([key, value]) => key}
            title="Code Editor Font"
            defaultValue="Monospace"
            onSelectDropDownItem={val => modifySettings('codeEditorFont', val)}
        />
    )
}

export default function CodeEditorSettings() {
    const {modifySettings} = useContext(SettingsContext);
    const [selectedTheme, setSelectedTheme] = useState('vs-dark');

    // const [panelStyle, setPanelStyle] = useState({
    //     visibility: "hidden",
    //     height: "0",
    //     pointerEvents: "none"
    // })

    const handleCustomThemeSelection = useCallback((event) => {
        // console.log(event.target.value);
        setSelectedTheme(event.target.value);

        // modify the settings object
        if (event.target.value !== 'custom') {
            modifySettings('themeMode', THEME_MODES.DEFAULT);
            modifySettings('defaultTheme', event.target.value);
        } else {
            modifySettings('themeMode', THEME_MODES.CUSTOM);
        }

        // open the custom theme panel 
        // if (event.target.value === "custom") {
        //     setPanelStyle({
        //         visibility: "visible",
        //         height: "350px",
        //         pointerEvents: "auto"
        //     })
        // } else {
        //     setPanelStyle({
        //         visibility: "hidden",
        //         height: "0",
        //         pointerEvents: "none"
        //     })
        // }
    }, [modifySettings]);

    // /**
    //  * Fires when the user selects a checkbox for font styles in the syntax highlight section.
    //  * @param {Event} event The event object (not actually used)
    //  * @param {number} token The index of the token in the customThemeSyntaxHighlight array 
    //  */
    // function handleSyntaxFontStylesChange(event, token) {
    //     const inputs = document.getElementById(`font-style-checkboxes-${token}`).querySelectorAll('input');
    //     const checkedBoxes = Array.from(inputs)
    //                             .filter(input => input.checked) 
    //                             .map(input => input.value);

    //     settings.temp.theme.addSyntaxHighlight(token, 'fontStyle', checkedBoxes);
    // }
    
    // /**
    //  * Fires when the user selects a colour for a syntax token in the syntax highlight section.
    //  * 
    //  * @param {Event} event The event object
    //  * @param {string} token The name of the syntax token
    //  */
    // function handleSyntaxColorChange(event, token) {
    //     settings.temp.theme.addSyntaxHighlight(token, event.target.name, event.target.value);
    // }

    // /**
    //  * Fires when the user selects a colour for a component in the editor colour scheme section.
    //  * 
    //  * @param {Event} event The event object 
    //  * @param {string} component The name of the component
    //  */
    // function handleEditorColourSchemeChange(event, component) {
    //     settings.temp.theme.addEditorComponentColor(component, event.target.value);
    // }

    return (
        <div id="code-editor-settings">
            <form id="code-editor-settings-form">
                <h1 className="one-settings-option-block" style={{ pointerEvents: "none" }}>Customise how your code editor looks and behaves.</h1>
                <div id="code-editor-theme" className="one-settings-option-block">
                    <h2>Theme</h2>
                    {Object.entries(presetThemes).map((theme) => (
                        <RadioInput 
                            name="theme"
                            key={theme[0]}
                            value={theme[0]}
                            onChange={handleCustomThemeSelection}
                            checked={theme[0] === selectedTheme}
                            content={theme[1].name}
                        />
                    ))}
                    {/* <RadioInput
                        name="theme"
                        value="custom"
                        onChange={handleCustomThemeSelection}
                        checked={selectedTheme === 'custom'}
                        content="Custom"
                        inputId="custom-theme-option"
                    /> */}
                </div>
                {/* <div id="custom-theme-panel" className="one-settings-option-block" style={panelStyle}>
                    <h3>Syntax Highlight (Note that the demonstration is in JavaScript if not stated)</h3> 
                    <table id="syntax-highlight">
                        <colgroup>
                            <col />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customThemeSyntaxHighlight.map((option, idx) => (
                                <tr key={idx}>
                                    <td className="token-cell">
                                        <HoverableContent mainContent={option.name} popUpContent={option.demo} />
                                    </td>
                                    <td className="option-cell">
                                        <ColorInput
                                            key={idx}
                                            name='foreground'
                                            content='Foreground'
                                            onChange={event => handleSyntaxColorChange(event, option.token)}
                                        />                                        
                                        <div id={`font-style-checkboxes-${idx}`}>
                                            <p style={{ padding: "5px 15px" }}>Font Styles</p>
                                            {FONT_STYLES.map( (style, i2) => (
                                                <CheckboxInput
                                                    name="fontStyles"
                                                    onChange={event => handleSyntaxFontStylesChange(event, idx)}
                                                    key={customThemeSyntaxHighlight.length + idx * 4 + i2}
                                                    value={style[0]}
                                                    content={style[1]}
                                                    inputClassname="prog-lang-checkbox-input"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Editor Colour Scheme</h3>
                    <div id="color-editor-scheme">
                        {customComponentColorScheme.map((comp, idx) => (
                            <ColorInput
                                name='color-editor-scheme'
                                key={idx}
                                content={comp.name}
                                onChange={event => handleEditorColourSchemeChange(event, comp.token)}
                            />
                        ))}
                    </div>
                </div> */}
                <div className="one-settings-option-block">
                    <h2>Text</h2>
                    <ProgLangOptions />
                    <CodeFontOptions />
                </div>
            </form>
        </div>
    )
}