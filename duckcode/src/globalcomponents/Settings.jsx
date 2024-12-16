import { useEffect, useState } from "react";
import { customThemeSyntaxHighlight, presetThemes } from "./color_schemes/themes";
import RadioInput from "./RadioInput";

const settingsOptions = [
    "General",
    "Code Editor",
    "Keyboard Shortcut Configuration",
];

// const settingsObject = {
//     "code-editor-theme": presetThemes[1],
// };

function CodeEditorSettings({ setEditorTheme }) {
    const [panelVisibility, setPanelVisibility] = useState('0');

    const handleCustomThemeSelection = (event) => {
        const option = document.getElementById('custom-theme-option');

        if (option.checked) {
            setPanelVisibility('250px');
        } else {
            setPanelVisibility('0');
        }
    }

    console.log(panelVisibility);

    return (
        <div id="code-editor-settings">
            <form id="code-editor-settings-form">
                <h1 className="one-settings-option-block">Customise how your code editor looks and behaves.</h1>
                <div id="code-editor-theme" className="one-settings-option-block">
                    <h2>Theme</h2>
                    {presetThemes.map((theme, idx) => (
                        <RadioInput 
                            key={idx}
                            name="theme"
                            value={theme.value}
                            onChange={handleCustomThemeSelection}
                            defaultChecked={theme.value==='vs-dark'}
                            content={theme.name}
                        />
                    ))}
                    <RadioInput 
                        name="theme"
                        value="custom"
                        onChange={handleCustomThemeSelection}
                        content="Custom"
                        inputId="custom-theme-option"
                    />
                </div>
                <div id="custom-theme-panel" className="one-settings-option-block" style={ {height: panelVisibility} }>
                    <h4>Syntax Highlight (Note that the demonstration is in JavaScript if not stated)</h4> 
                    <table id="syntax-highlight">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Options</th>
                                <th>Demonstration</th>
                            </tr>
                        </thead>
                        {customThemeSyntaxHighlight.map((option, idx) => (
                            <tr>
                                <td className="token-cell">{option.name}</td>
                                <td className="option-cell">
                                    <label id={idx}>Foreground:
                                        <input type="color" />
                                    </label>
                                    <label id={idx}>Background:
                                        <input type="color" />
                                    </label>
                                </td>
                                <td className="demo-cell">
                                    <p className="demo-syntax">{option.demo}</p>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </form>
        </div>
    )
}

export default function Settings({ 
    displayMode="none", 
    setDisplayMode,
    setEditorTheme }) {
    useEffect(() => {
        const escapeFromSettings = (event) => {
            if (event.key === "Escape") {
                setDisplayMode("none");
            }
        }

        window.addEventListener('keydown', escapeFromSettings);

        return () => {
            window.removeEventListener('keydown', escapeFromSettings);
        }
    }, [setDisplayMode]);

    const style = {
        display: displayMode,
    };

    return (
        <div id="settings-fullscreen-cover" style={style}>
            <div id="settings">
                <ul id="settings-option">
                    {settingsOptions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
                <div id="settings-display">
                    <CodeEditorSettings setEditorTheme={setEditorTheme} />
                </div>
            </div>
        </div>
    )
}
