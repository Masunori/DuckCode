import './styles/App.css';
import Gameplay from './pages/Gameplay/Gameplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnsupportedScreenNotification from './globalcomponents/UnsupportedScreenNotification';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { THEME_MODES, EditorThemeObject, OverallThemeObject } from './globalcomponents/color_schemes/themes';
import { PROGRAMMING_LANGUAGES } from './globalcomponents/constants';
import Portal from './pages/Portal/Portal';
import Landing from './pages/Landing/Landing';
import MainMenu from './pages/MainMenu/MainMenu';

export const SettingsContext = createContext(null);

export default function App() {
    const [frozen, setFrozen] = useState(true);
    const monacoRef = useRef(null);

    const history = useRef(null);

    const temp = useRef({
        themeMode: THEME_MODES.DEFAULT,
        defaultTheme: 'vs-dark',
        theme: new EditorThemeObject(),
        progLang: PROGRAMMING_LANGUAGES['javascript'],
        codeEditorFont: 'monospace',
        overallTheme: new OverallThemeObject(),
    })

    const [current, setCurrent] = useState({
        themeMode: THEME_MODES.DEFAULT,
        defaultTheme: 'vs-dark',
        theme: new EditorThemeObject(),
        progLang: PROGRAMMING_LANGUAGES['javascript'],
        codeEditorFont: 'monospace',
        overallTheme: new OverallThemeObject(),   
    });

    const pristine = useRef({
        themeMode: THEME_MODES.DEFAULT,
        defaultTheme: 'vs-dark',
        theme: new EditorThemeObject(),
        progLang: PROGRAMMING_LANGUAGES['javascript'],
        codeEditorFont: 'monospace',
        overallTheme: new OverallThemeObject(),
    })

    function modifySettings(key, value) {
        if (!(key in temp.current)) {
            return;
        }

        temp.current[key] = value;
    }

    function assignMonacoInstance(monacoInstance) {
        monacoRef.current = monacoInstance;
    }

    const saveSettings = useCallback(() => {
        history.current = structuredClone(current);
        setCurrent(structuredClone(temp.current));
    }, [current]);

    function revertSettings() {
        setCurrent(structuredClone(history.current));
    }

    function resetSettings() {
        setCurrent(structuredClone(pristine.current));
        temp.current = structuredClone(pristine.current);
    }

    const settingsContextObject = useMemo(() => ({
        'history': history,
        'settings': current,
        'temp': temp,
        'modifySettings': modifySettings,
        'assignMonacoInstance': assignMonacoInstance,
        'saveSettings': saveSettings,
        'revertSettings': revertSettings,
        'resetSettings': resetSettings,
        'frozen': frozen,
        'setFrozen': setFrozen
    }), [current, frozen, saveSettings]);

    useEffect(() => {
        const themeAlias = current.defaultTheme;
        monacoRef?.current?.editor?.setTheme(themeAlias); 

        document.documentElement.style.setProperty('--background-color', current.overallTheme.theme.background.value);
        document.documentElement.style.setProperty('--first-layer-background-color', current.overallTheme.theme.firstLayerBackground.value);
        document.documentElement.style.setProperty('--second-layer-background-color', current.overallTheme.theme.secondLayerBackground.value);
        document.documentElement.style.setProperty('--third-layer-background-color', current.overallTheme.theme.thirdLayerBackground.value);
        document.documentElement.style.setProperty('--fourth-layer-background-color', current.overallTheme.theme.fourthLayerBackground.value);
        document.documentElement.style.setProperty('--significant-button-color', current.overallTheme.theme.significantChoiceButton.value);
        document.documentElement.style.setProperty('--significant-button-hover-color', current.overallTheme.theme.significantChoiceButtonSelected.value);
        document.documentElement.style.setProperty('--insignificant-button-color', current.overallTheme.theme.insignificantChoiceButton.value);
        document.documentElement.style.setProperty('--insignificant-button-hover-color', current.overallTheme.theme.insignificantChoiceButtonSelected.value);
        document.documentElement.style.setProperty('--settings-option-bg-color', current.overallTheme.theme.settingsOptionBackground.value);
        document.documentElement.style.setProperty('--settings-bg-color', current.overallTheme.theme.settingsBackground.value);
        document.documentElement.style.setProperty('--settings-option-border-color', current.overallTheme.theme.settingsOptionBorder.value);

        document.documentElement.style.setProperty('--normal-text-font', current.overallTheme.theme.overallFont.value);
    }, [current]);

    return (
        <SettingsContext.Provider value={settingsContextObject} id='app'>
            <Router>
                <Routes>
                    <Route path='/' element={<Landing />}/>
                    <Route path='/gameplay' element={<Gameplay />}></Route>
                    <Route path='/portal' element={<Portal />}></Route>
                    <Route path='/home' element={<MainMenu />}></Route>
                </Routes>
            </Router>
            <UnsupportedScreenNotification />
        </SettingsContext.Provider>
    );
}