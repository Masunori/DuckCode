import './gameplay.css';
import CodeHandler from './code_handler/CodeHandler';
import GameplayNavbar from './GameplayNavbar';
import Question from './Question';
import Settings from '../../globalcomponents/settings_components/Settings';
import { createContext, useContext, useState } from 'react';
import { SettingsContext } from '../../App';
import { useLocation } from 'react-router-dom';

export const QuestionContext = createContext(null);

/**
 * Encapsulates the gameplay interface of DuckCode.
 * @returns The gameplay screen
 */
export default function Gameplay() {
    const {settings} = useContext(SettingsContext);

    const [codeEditorContent, setCodeEditorContent] = useState(settings.progLang.code_snippet);
    const location = useLocation();
    
    return (
        <QuestionContext.Provider value={location.state.questionResponse}>
            <div id='entire-gameplay-screen'>
                <GameplayNavbar />
                <div id="gameplay">
                    <Question />
                    <CodeHandler
                        codeEditorContent={codeEditorContent}
                        setCodeEditorContent={setCodeEditorContent}
                    />
                </div>
                <Settings setCodeSnippet={setCodeEditorContent} />
            </div>
        </QuestionContext.Provider>
    )
}