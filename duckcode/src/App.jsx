import './styles/App.css';
import Gameplay from './pages/Gameplay/Gameplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnsupportedScreenNotification from './globalcomponents/UnsupportedScreenNotification';
import { createContext, useRef, useState } from 'react';
import { THEME_MODES, ThemeObject } from './globalcomponents/color_schemes/themes';
import { PROGRAMMING_LANGUAGES } from './globalcomponents/constants';

export const SettingsContext = createContext(null);

/**
 * A custom React hook that 
 * 
 * @returns 
 */
const useSettings = () => {
    const [frozen, setFrozen] = useState(true);
    const monacoRef = useRef(null);

    const [settings, setSettings] = useState({
        history: null,
        current: {
            // themeMode: THEME_MODES.DEFAULT,
            defaultTheme: 'vs-dark',
            // theme: new ThemeObject(),
            progLang: PROGRAMMING_LANGUAGES['javascript'],
            codeEditorFont: 'monospace',    
        },
        temp: {
            // themeMode: THEME_MODES.DEFAULT,
            defaultTheme: 'vs-dark',
            // theme: new ThemeObject(),
            progLang: PROGRAMMING_LANGUAGES['javascript'],
            codeEditorFont: 'monospace',
        },
        frozen,
        setFrozen,
        monacoRef
    });

    function modifySettings(key, value) {
        if (!(key in Object.keys(settings.current))) {
            return;
        }

        setSettings(prev => ({
            ...prev,
            current: {
                ...prev.current,
                [key]: value
            }
        }));
    }

    return [settings, modifySettings];
}

export default function App() {
    const [frozen, setFrozen] = useState(true);

    const monacoRef = useRef(null);

    /**
     * The settingsRef object contains the following keys:
     * - history (object): the previous settings object
     * - current (object): the current settings object
     * - temp (object): the temporary settings object
     * - isSettingsFrozen (boolean): whether the settings are frozen
     * - setIsSettingsFrozen (function): set the isSettingsFrozen state
     * - currTheme (ThemeObject): the current theme object
     * - setCurrTheme (function): set the currTheme state
     * Freeze settings make sure that key bindings specific to settings will not be triggered outside settings.
     */
    const settings = {
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
        frozen,
        setFrozen,
        monacoRef
    };

    return (
        <SettingsContext.Provider value={settings} id='app'>
            <Router>
                <Routes>
                    <Route path='/gameplay' element={<Gameplay />}></Route>
                    </Routes>
                </Router>
            <UnsupportedScreenNotification />
        </SettingsContext.Provider>
    );
}