import './gameplay.css';
import CodeHandler from './code_handler/CodeHandler';
import GameplayNavbar from './GameplayNavbar';
import Question from './Question';
import Settings from '../../globalcomponents/settings_components/Settings';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SettingsContext } from '../../App';
import Loading from '../../globalcomponents/utility_screen/Loading';

const questionResponse = {
    qid: 10000000, // int
    title: 'Two Sum', // string
    difficulty: 1000, // int
    description: [
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
        "Arrange the values in your answer in INCREASING order."
    ], // string array
    input: [
        'Line 1 contains 1 integer, specifying the size n of the nums array.',
        'Line 2 contains n integers, specifying the elements of the array.',
        'Line 3 contains 1 integer, specifying the target.'
    ], // string array
    output: [
        'One line containing two integers, specifying the indices of the pair of numbers whose sum equals the target.',
        'Return the two integers in increasing order.'
    ], // string array
    examples: [ // JSON object array
        {
            input: [
                '4',
                '1 3 4 6',
                '9',
            ], // string array
            output: [
                '1 3',
            ], // string array
            explanation: 'Because nums[1] + nums[3] == 7, we print 1 and 3.' // string
        }
    ],
    constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists'
    ], // string array
    publicTestCases: [ // JSON object array
        {
            tid: 12345678,
            input: ['4', '2 7 11 15', '9'], // string array
            expectedOutput: [
                '0 1',
            ], // string array
        },
        {
            tid: 12345679,
            input: ['3', '3 2 4', '6'], // string array
            expectedOutput: [
                '1 2',
            ], // string array
        },
        {
            tid: 12345680,
            input: ['2', '3 3', '6'], // string array
            expectedOutput: [
                '0 1',
            ], // string array
        },
        {
            tid: 12345681,
            input: ['4', '1 7 2 9', '16'], // string array
            expectedOutput: [
                '1 3',
            ], // string array
        },
        {
            tid: 12345682,
            input: ['6', '1 2 7 8 12 13', '10'], // string array
            expectedOutput: [
                '1 3',
            ], // string array
        }
    ]
}

export const QuestionContext = createContext(null);

/**
 * Encapsulates the gameplay interface of DuckCode.
 * @returns The gameplay screen
 */
export default function Gameplay() {
    const [question, setQuestion] = useState(null);

    const difficulty = useRef(1000);

    useEffect(() => {
        // On entering the gameplay screen, fetch a question based on the current difficulty
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`http://13.236.119.143/get_question?cur_point=${difficulty.current}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch question! Status: ${response.status}`);
                }

                const result = await response.json();
                setQuestion(result);
            } catch (error) {
                console.error(error);
            }
        };

        setTimeout(fetchQuestion, 1000);
        // fetchQuestion();
    }, []);

    const {settings} = useContext(SettingsContext);

    const [codeEditorContent, setCodeEditorContent] = useState(settings.progLang.code_snippet);

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
                        testCases={ questionResponse.publicTestCases }
                        codeEditorContent={codeEditorContent}
                        setCodeEditorContent={setCodeEditorContent}
                    />
                </div>
                <Settings setCodeSnippet={setCodeEditorContent} />
            </div>
        </QuestionContext.Provider>
    )
}