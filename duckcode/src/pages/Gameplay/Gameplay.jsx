import './gameplay.css';
import CodeHandler from './code_handler/CodeHandler';
import GameplayNavbar from './GameplayNavbar';
import Question from './Question';
import Settings from '../../globalcomponents/settings_components/Settings';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SettingsContext } from '../../App';
import Loading from '../../globalcomponents/utility_screen/Loading';
import { getQuestionFake } from '../../services/gameplay/getQuestion';

export const QuestionContext = createContext(null);

/**
 * Encapsulates the gameplay interface of DuckCode.
 * @returns The gameplay screen
 */
export default function Gameplay() {
    const [question, setQuestion] = useState(null);

    const difficulty = useRef(1000);

    const {settings} = useContext(SettingsContext);

    const [codeEditorContent, setCodeEditorContent] = useState(settings.progLang.code_snippet);

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const questionResponse = await getQuestionFake(difficulty.current);
                setQuestion(questionResponse);
            } catch (error) {
                console.error(error);
            }
        }

        fetchQuestion();
    }, []);

    if (!question) {
        return <Loading />;
    }

    return (
        <QuestionContext.Provider value={question}>
            <div id='entire-gameplay-screen'>
                <GameplayNavbar />
                <div id="gameplay">
                    <Question />
                    <CodeHandler 
                        testCases={ question.publicTestCases }
                        codeEditorContent={codeEditorContent}
                        setCodeEditorContent={setCodeEditorContent}
                    />
                </div>
                <Settings setCodeSnippet={setCodeEditorContent} />
            </div>
        </QuestionContext.Provider>
    )
}