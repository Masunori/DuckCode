import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PROGRAMMING_LANGUAGES, SETTINGS_OPTIONS, SETTINGS_STATUS } from "./constants";
import CodeEditorSettings from "./settings_components/CodeEditorSettings";
import KeyboardShortcutSettings from "./settings_components/KeyboardShortcutSettings";
import { SettingsContext } from "../App";
import Confirm, { openConfirmWithMessage } from "./Confirm";
import GeneralSettings from "./settings_components/GeneralSettings";

/**
 * Returns a Settings component that can be open or closed (almost) anywhere in the game.
 * 
 * @param {object} param0 The object literal containing the following pairs
 * - setValue (function): set the content of the code editor.
 * @returns the Settings component.
 */
export default function Settings({ setValue=(value)=>null }) {
    const {history, temp, saveSettings, revertSettings, resetSettings, frozen, setFrozen} = useContext(SettingsContext);
    const [settingsStatus, setSettingsStatus] = useState(SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT);
    
    const settingsOptionsRef = useRef([]);
    const [option, setOption] = useState('General');

    /**
     * Save the current settings.
     * @param {Event} event 
     */
    function saveSettingsWrapper(event) {
        saveSettings();
        setValue(temp.current.progLang.code_snippet);
        setSettingsStatus(SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT);
    }

    /**
     * Revert to the settings 1 step back.
     * 
     * @param {Event} event 
     */
    function revertSettingsWrapper(event) {
        revertSettings();
        setValue(history.current.progLang.code_snippet);
        setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CANNOT_REVERT);
    }

    /**
     * Reset to the default settings.
     * 
     * @param {Event} event 
     */
    function resetSettingsWrapper(event) {
        resetSettings();
        setValue(PROGRAMMING_LANGUAGES['javascript'].code_snippet);
        setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CAN_REVERT);
    }

    const cachedRevertSettings = useCallback(revertSettingsWrapper, [revertSettings, setValue, history]);

    /*
        These two functions handle the mouse hover effect on the settings options.
    */

    /**
     * Handle when the mouse is over the settings option.
     * @param {number} idx The index of the option
     */
    const handleMouseEnter = (idx) => {
        settingsOptionsRef.current[idx].style.backgroundColor = "var(--settings-bg-color)";
    }

    /**
     * Handle when the mouse leaves the settings option.
     * @param {number} idx The index of the option
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
                            ? 'var(--settings-bg-color)'
                            : 'var(--settings-option-bg-color)';

    useEffect(() => {
        const escapeFromSettings = (event) => {
            const isEsc = event.type === 'keydown' && event.key === 'Escape';
            const isExitClick = event.type === 'click';

            if (!frozen && (isEsc || isExitClick)) {
                if (Object.values(SETTINGS_STATUS.CANNOT_SAVE).includes(settingsStatus)) {
                    setFrozen(true);
                    setSettingsStatus(SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT);
                    history.current = null;
                } else {
                    openConfirmWithMessage(
                        "Do you want to exit without saving your settings?",
                        "Back to Settings",
                        "Exit",
                        () => null,
                        () => {
                            setFrozen(true);
                            setSettingsStatus(SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT);
                            history.current = null;
                        }
                    );
                }
            }
        }

        // Press 'ESC' to exit settings.
        window.addEventListener('keydown', escapeFromSettings);

        // or click the exit button.
        const exitButton = document.getElementById('settings-exit-button');
        exitButton.addEventListener('click', escapeFromSettings);

        // When the user types in the input fields, the save function is enabled
        const enableSave = (event) => {
            if (settingsStatus === SETTINGS_STATUS.CANNOT_SAVE.CANNOT_REVERT) {
                setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CANNOT_REVERT);
            } else if (settingsStatus === SETTINGS_STATUS.CANNOT_SAVE.CAN_REVERT) {
                setSettingsStatus(SETTINGS_STATUS.CAN_SAVE.CAN_REVERT);
            }
        }

        // const inputElements = document.getElementById('settings').querySelectorAll('[class$="-label"]');
        const inputElements = document.getElementById('settings').querySelectorAll('input');
        inputElements.forEach(input => input.addEventListener('input', enableSave));

        // Press 'CTRL' + 'Z' to revert the settings.
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
            exitButton.removeEventListener('click', escapeFromSettings);
        }
    }, [setSettingsStatus, settingsStatus, cachedRevertSettings, frozen, setFrozen, history]);

    return (
        <div id="settings-fullscreen-cover" style={{ display: frozen ? "none" : "block" }}>
            <Confirm />
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
                    <button id="settings-exit-button">Exit</button>
                    <button 
                        id="settings-reset-button" 
                        onClick={() => openConfirmWithMessage(
                            "Reset to the default settings?",
                            "Cancel",
                            "Reset",
                            () => {return;},
                            resetSettingsWrapper
                        )}
                    >Reset</button>
                </div>
            </div>
        </div>
    )
}
