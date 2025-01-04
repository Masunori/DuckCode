import { useState, useEffect, useContext } from "react";
import { /* CheckboxInput, ColorInput, */ RadioInput } from "../Input";
// import HoverableContent from "../HoverableContent";
import { /* FONT_STYLES, */ PROGRAMMING_LANGUAGES, FONT_FAMILIES } from "../constants";
import { presetThemes, /* customThemeSyntaxHighlight, customComponentColorScheme, */THEME_MODES, /* ThemeObject */ } from "../color_schemes/themes";
import { SettingsContext } from "../../App";

function ProgLangOptions() {
    const [dropDownHeight, setDropDownHeight] = useState('0');
    const [currProgLang, setCurrProgLang] = useState('javascript');

    const {modifySettings} = useContext(SettingsContext);

    // function handleChooseProgLang(event) {
    //     setCurrProgLang(event.target.value);
    //     settings.temp.progLang = PROGRAMMING_LANGUAGES[event.target.value];
    // }

    useEffect(() => {
        function openDropDown(event) {
            setDropDownHeight('200px');
            event.stopPropagation();
        }

        const langInput = document.getElementById('prog-lang-input');
        const fontInput = document.getElementById('code-font-input');
        
        function closeDropDown(event) {
            setDropDownHeight('0');
        }

        // when the user clicks on the programming language input, open the prog-lang dropdown and close the font dropdown
        // when the user clicks on the window, close the prog-lang dropdown
        langInput.addEventListener('click', openDropDown);
        window.addEventListener('click', closeDropDown);
        fontInput.addEventListener('click', closeDropDown);

        function handleProgLangOptionClick(event) {
            setCurrProgLang(event.target.dataset.key);
            modifySettings('progLang', PROGRAMMING_LANGUAGES[event.target.dataset.value]);
            // settings.temp.progLang = PROGRAMMING_LANGUAGES[event.target.dataset.value];
            // console.table(settings.temp.progLang.monaco_editor_alias)
            closeDropDown(event);
        }

        const progLangOptions = document.querySelectorAll('.prog-lang-option');
        progLangOptions.forEach(option => {
            option.addEventListener('click', handleProgLangOptionClick);
        });

        return (() => {
            langInput.removeEventListener('click', openDropDown);
            window.removeEventListener('click', closeDropDown);
            fontInput.removeEventListener('click', closeDropDown);
            progLangOptions.forEach(option => {
                option.removeEventListener('click', handleProgLangOptionClick)
            });
        })
    }, [setDropDownHeight, setCurrProgLang, modifySettings])

    return (
        <div id="prog-lang-dropdown-container">
            <p>Programming Languages</p>
            <label htmlFor="prog-lang-input" id="prog-lang-label">
                <input id="prog-lang-input" value={currProgLang} readOnly />
                <div id="prog-lang-options-dropdown" style={{ height: dropDownHeight }}>
                    {Object.entries(PROGRAMMING_LANGUAGES).map(([key, value]) => (
                        <div key={key} className="prog-lang-option" data-key={key} data-value={value.monaco_editor_alias}>
                            <span>{key}</span>
                            <span style={{ opacity: 0.25 }}>({value.version})</span>
                        </div>
                    ))}
                </div>
            </label>
        </div>
    )
}

function CodeFontOptions() {
    const [currFont, setCurrFont] = useState('monospace');
    const [dropDownHeight, setDropDownHeight] = useState('0');

    const {modifySettings} = useContext(SettingsContext);

    useEffect(() => {
        function openDropDown(event) {
            setDropDownHeight('200px');
            event.stopPropagation();
        }

        const langInput = document.getElementById('prog-lang-input');
        const fontInput = document.getElementById('code-font-input');
        
        function closeDropDown(event) {
            setDropDownHeight('0');
        }

        fontInput.addEventListener('click', openDropDown);
        window.addEventListener('click', closeDropDown);
        langInput.addEventListener('click', closeDropDown);

        return (() => {
            fontInput.removeEventListener('click', openDropDown);
            window.removeEventListener('click', closeDropDown);
            langInput.removeEventListener('click', closeDropDown);
        })
    }, [setDropDownHeight])

    function handleChooseFont(event) {
        setCurrFont(event.target.value);
        modifySettings('codeEditorFont', event.target.value);
    }

    return (
        <div id="prog-lang-dropdown-container">
            <p>Code Editor Font</p>
            <label htmlFor="code-font-input" id="code-font-label">
                <input id="code-font-input" value={currFont} style={{ fontFamily: currFont }} readOnly />
                <div id="code-font-options-dropdown" style={{ height: dropDownHeight }}>
                    {FONT_FAMILIES.map((font, idx) => (
                        <option 
                            className="code-font-option"
                            key={idx} 
                            onClick={handleChooseFont}
                            style={{
                                fontFamily: font
                            }}
                        >{font}
                        </option>
                    ))}
                </div>
            </label>
        </div>
    )
}

export default function CodeEditorSettings({ setEditorTheme, settingsObject }) {
    const {modifySettings} = useContext(SettingsContext);
    const [selectedTheme, setSelectedTheme] = useState('vs-dark');

    // const [panelStyle, setPanelStyle] = useState({
    //     visibility: "hidden",
    //     height: "0",
    //     pointerEvents: "none"
    // })

    const handleCustomThemeSelection = (event) => {
        setSelectedTheme(event.target.value);

        // modify the settings object
        if (event.target.value !== 'custom') {
            // settings.temp.themeMode = THEME_MODES.DEFAULT;
            modifySettings('themeMode', THEME_MODES.DEFAULT);
            modifySettings('defaultTheme', event.target.value);
            // settings.temp.defaultTheme = event.target.value;
        } else {
            // settings.temp.themeMode = THEME_MODES.CUSTOM;
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
    }

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
                    {Object.entries(presetThemes).map((theme, idx) => (
                        <RadioInput 
                            name="theme"
                            key={idx}
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