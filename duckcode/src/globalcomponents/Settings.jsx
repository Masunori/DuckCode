import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SETTINGS_OPTIONS, SETTINGS_STATUS } from "./constants";
import CodeEditorSettings from "./settings_components/CodeEditorSettings";
import KeyboardShortcutSettings from "./settings_components/KeyboardShortcutSettings";
import { SettingsContext } from "../App";
import Confirm, { openConfirmWithMessage } from "./Confirm";
import GeneralSettings from "./settings_components/GeneralSettings";

/**
 * Returns a Settings component that can be open or closed (almost) anywhere in the game.
 * 
 * @param {object} param0 The object literal containing the following pairs
 * - setEditorTheme (function): The function to set the editor theme.
 * @returns the Settings component.
 */
export default function Settings() {
    const {saveSettings, revertSettings, frozen, setFrozen} = useContext(SettingsContext);
    const [settingsStatus, setSettingsStatus] = useState(SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT);
    
    const settingsOptionsRef = useRef([]);
    const [option, setOption] = useState('General');

    /**
     * Save the current settings.
     * @param {Event} event 
     */
    function saveSettingsWrapper(event) {
        // const theme = settings.current.themeMode === THEME_MODES.DEFAULT
        //                 ? settings.current.defaultTheme.theme
        //                 : settings.current.theme.theme;

        // settings.history = settings.current;
        // settings.current = structuredClone(settings.temp);

        saveSettings();
        setSettingsStatus(SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT);;
        // const themeAlias = settings.current.defaultTheme;
        // const editor = settings.monacoRef.current.editor;
        // editor.setTheme(themeAlias);
        // alert(settings.current.progLang.monaco_editor_alias);
        // editor.setModelLanguage(
        //     settings.current.progLang.code_snippet,
        //     settings.current.progLang.monaco_editor_alias
        // );
    }

    /**
     * Revert to the settings 1 step back.
     * 
     * @param {Event} event 
     */
    function revertSettingsWrapper(event) {
        // settings.current = structuredClone(settings.history);
        revertSettings();
        setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CANNOT_REVERT);

        // const themeAlias = settings.current.defaultTheme;
        // settings.monacoRef.current.editor.setTheme(themeAlias);
    }

    const cachedRevertSettings = useCallback(revertSettingsWrapper, [revertSettings]);

    /*
        These two functions handle the mouse hover effect on the settings options.
    */

    /**
     * Handle when the mouse is over the settings option.
     * @param {*} idx 
     */
    const handleMouseEnter = (idx) => {
        settingsOptionsRef.current[idx].style.backgroundColor = "var(--settings-option-bg-selected-color)";
    }

    /**
     * Handle when the mouse leaves the settings option.
     * @param {number} idx 
     */
    const handleMouseLeave = (idx) => {
        if (settingsOptionsRef.current[idx].innerText !== option) {
            settingsOptionsRef.current[idx].style.backgroundColor = "var(--settings-option-bg-color)";    
        }
    }

    /**
     * Handle the event when the user clicks on any of the settings option.
     * The settings option is the left column of the settings tab.
     * 
     * @param {Event} event 
     */
    const handleOnClick = (event) => {
        setOption(event.target.innerText);

        Object.entries(SETTINGS_OPTIONS).forEach(([key, value]) => {
            const block = document.getElementById(key);
            if (event.target.innerText === value) {
                block.style.display = "grid";
            } else {
                block.style.display = "none";
            }
        });
    }

    const bgCol = (item) => item === option
                            ? 'var(--settings-option-bg-selected-color)'
                            : 'var(--settings-option-bg-color)';

    useEffect(() => {
        /*
            Press 'ESC' to exit settings.
        */
        const escapeFromSettings = (event) => {
            if (!frozen && event.key === "Escape") {
                setFrozen(true);
            }
        }
        
        window.addEventListener('keydown', escapeFromSettings);
        /*
            When the user types in the input fields, the save function is enabled
        */
        const enableSave = (event) => {
            if (settingsStatus === SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT) {
                setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CANNOT_REVERT);
            } else if (settingsStatus === SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT) {
                setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CAN_REVERT);
            }
        }

        const inputElements = document.querySelectorAll('[class$="-label"], [id$="-label"]');
        inputElements.forEach(input => input.addEventListener('click', enableSave));

        /*
            Press 'CTRL' + 'Z' to revert the settings.
        */
        const handleRevert = (event) => {
            if (!frozen && event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault();
                cachedRevertSettings();
            }
        }
        window.addEventListener('keyup', handleRevert);

        return () => {
            window.removeEventListener('keydown', escapeFromSettings);
            inputElements.forEach(input => input.removeEventListener('input', enableSave));
            window.removeEventListener('keyup', handleRevert);
        }
    }, [setSettingsStatus, settingsStatus, cachedRevertSettings, frozen, setFrozen]);

    return (
        <div id="settings-fullscreen-cover" style={{ display: frozen ? "none" : "block" }}>
            <Confirm 
                message="Save the current settings? You can still revert until you exit this tab."
                cancelMessage="Cancel"
                proceedMessage="Save"
                onProceed={saveSettingsWrapper}
            />
            <div id="settings">
                <ul id="settings-option">
                    {Object.entries(SETTINGS_OPTIONS).map(([key, value], idx) => (
                        <li key={idx}
                            ref={el => settingsOptionsRef.current[idx] = el}
                            style={{ backgroundColor: bgCol(value), cursor: "pointer" }}
                            onClick={handleOnClick} 
                            onMouseEnter={event => handleMouseEnter(idx)}
                            onMouseLeave={event => handleMouseLeave(idx)}
                        >{value}</li>
                    ))}
                </ul>
                <div id="settings-display">
                    <GeneralSettings />
                    <CodeEditorSettings />
                    <KeyboardShortcutSettings />
                    <button 
                        id="settings-save-button" 
                        style={{     
                            opacity: Object.values(SETTINGS_STATUS.CAN_SAVE).includes(settingsStatus) ? '1' :'0.5',
                            pointerEvents: Object.values(SETTINGS_STATUS.CAN_SAVE).includes(settingsStatus) ? 'auto' : 'none'
                        }} 
                        onClick={() => openConfirmWithMessage(
                            "Save the current settings? You can still revert until you exit this tab.",
                            "Cancel",
                            "Save",
                            () => {return;},
                            saveSettingsWrapper
                        )}
                    >Save</button>
                    <button 
                        id="settings-revert-button" 
                        style={{
                            opacity: [SETTINGS_STATUS.CAN_SAVE.CAN_REVERT, SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT].includes(settingsStatus) ? '1' : '0.5',
                            pointerEvents: [SETTINGS_STATUS.CAN_SAVE.CAN_REVERT, SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT].includes(settingsStatus) ? 'auto' : 'none'
                        }} 
                        onClick={revertSettingsWrapper}
                    >Revert</button>
                </div>
            </div>
        </div>
    )
}
