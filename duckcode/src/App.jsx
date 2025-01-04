import './styles/App.css';
import Gameplay from './pages/Gameplay/Gameplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnsupportedScreenNotification from './globalcomponents/UnsupportedScreenNotification';
import { createContext, useRef, useState } from 'react';
import { THEME_MODES, ThemeObject } from './globalcomponents/color_schemes/themes';
import { PROGRAMMING_LANGUAGES } from './globalcomponents/constants';

export const SettingsContext = createContext(null);

export default function App() {
    // /**
    //  * The settingsRef object contains the following keys:
    //  * - history (object): the previous settings object
    //  * - current (object): the current settings object
    //  * - temp (object): the temporary settings object
    //  * - isSettingsFrozen (boolean): whether the settings are frozen
    //  * - setIsSettingsFrozen (function): set the isSettingsFrozen state
    //  * - currTheme (ThemeObject): the current theme object
    //  * - setCurrTheme (function): set the currTheme state
    //  * Freeze settings make sure that key bindings specific to settings will not be triggered outside settings.
    //  */
    // // const settings = {
    // //     history: null,
    // //     current: {
    // //         themeMode: THEME_MODES.DEFAULT,
    // //         defaultTheme: 'vs-dark',
    // //         theme: new ThemeObject(),
    // //         progLang: PROGRAMMING_LANGUAGES['javascript'],
    // //         codeEditorFont: 'monospace',    
    // //     },
    // //     temp: {
    // //         themeMode: THEME_MODES.DEFAULT,
    // //         defaultTheme: 'vs-dark',
    // //         theme: new ThemeObject(),
    // //         progLang: PROGRAMMING_LANGUAGES['javascript'],
    // //         codeEditorFont: 'monospace',
    // //     },
    // //     frozen,
    // //     setFrozen,
    // //     monacoRef
    // // };
    const [frozen, setFrozen] = useState(true);
    const monacoRef = useRef(null);

    const [settings, setSettings] = useState({
        history: null,
        current: {
            themeMode: THEME_MODES.DEFAULT,
            defaultTheme: 'vs-dark',
            theme: new ThemeObject(),
            progLang: PROGRAMMING_LANGUAGES['javascript'],
            codeEditorFont: 'monospace',    
        },
        temp: {
            themeMode: THEME_MODES.DEFAULT,
            defaultTheme: 'vs-dark',
            theme: new ThemeObject(),
            progLang: PROGRAMMING_LANGUAGES['javascript'],
            codeEditorFont: 'monospace',
        },
        monaco: monacoRef.current
    });

    function modifySettings(key, value) {
        console.log(Object.keys(settings.current));
        console.log(key);
        if (!(key in settings.current)) {
            // console.log('Key not found!');
            return;
        }

        setSettings(prev => ({
            ...prev,
            temp: {
                ...prev.temp,
                [key]: value
            }
        }));

        console.log(settings);
    }

    function assignMonacoInstance(monacoInstance) {
        setSettings(prev => ({
            ...prev,
            monaco: monacoInstance
        }));
    }

    function saveSettings() {
        setSettings(prev => ({
            ...prev,
            history: structuredClone(prev.current),
            current: structuredClone(prev.temp)
        }));

        const themeAlias = settings.current.defaultTheme;
        const editor = settings.monaco.editor;
        editor.setTheme(themeAlias);
    }

    function revertSettings() {
        setSettings(prev => ({
            ...prev,
            current: structuredClone(prev.history)
        }));

        const themeAlias = settings.current.defaultTheme;
        settings.monaco.editor.setTheme(themeAlias);
    }

    const settingsContextObject = {
        'settings': settings,
        'modifySettings': modifySettings,
        'assignMonacoInstance': assignMonacoInstance,
        'saveSettings': saveSettings,
        'revertSettings': revertSettings,
        'frozen': frozen,
        'setFrozen': setFrozen
    }

    return (
        <SettingsContext.Provider value={settingsContextObject} id='app'>
            <Router>
                <Routes>
                    <Route path='/gameplay' element={<Gameplay />}></Route>
                    </Routes>
                </Router>
            <UnsupportedScreenNotification />
        </SettingsContext.Provider>
    );
}