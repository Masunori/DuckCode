import './gameplay.css';
import CodeHandler from './code_handler/CodeHandler';
import GameplayNavbar from './GameplayNavbar';
import Question, { QuestionTemplate } from './Question';
import Settings from '../../globalcomponents/Settings';
import { useState } from 'react';
import { presetThemes } from '../../globalcomponents/color_schemes/themes';

const title = 'Two Sum';
const difficulty = 1000;

const description = [
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
    "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
    "Arrange the values in your answer in INCREASING order."
].join("\n");

// const examples = [
//     ['nums = [2, 7, 11, 15], target = 9', '[0, 1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].'],
//     ['nums = [3, 2, 4], target = 6', '[1, 2]', null],
//     ['nums = [3, 3], target = 6', '[0, 1]', null]
// ]

const input = 'Line 1 contains 1 integer, specifying the size n of the nums array.\nLine 2 contains n integers, specifying the elements of the array.\nLine 3 contains 1 integer, specifying the target';
const output = 'One line containing two integers, specifying the indices of the pair of numbers whose sum equals the target.';

const constraint = [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists'
].join('\n');

const testCases = [
    ['4\n2\n7\n11\n15\n9\n', '0 1'],
    ['3\n3\n2\n4\n6\n', '1 2'],
    ['2\n3\n3\n6\n', '0 1'],
    ['4\n1\n7\n2\n9\n16\n', '1 3'],
    ['4\n1\n2\n7\n8\n12\n13\n10\n', '1 3']
];

const examples = [
    'Input',
    '4',
    '1 3 4 6',
    '9',
    'Output',
    '1 3',
    'Explanation',
    'Because nums[1] + nums[3] == 7, we print 1 and 3.'
].join('\n');

const dummyQTemplate = new QuestionTemplate(
    title,
    difficulty,
    input,
    output,
    description,
    examples,
    constraint
);

export default function Gameplay() {
    const [settingsDisplayMode, setSettingsDisplayMode] = useState("none");
    const [editorTheme, setEditorTheme] = useState(presetThemes[4])

    return (
        <div id='entire-gameplay-screen'>
            <GameplayNavbar setSettiings={setSettingsDisplayMode} />
            <div id="gameplay">
                <Question questionTemplate={ dummyQTemplate } />
                <CodeHandler 
                    testCases={testCases}
                    editorTheme={editorTheme}
                />
            </div>
            <Settings 
                displayMode={settingsDisplayMode} 
                setDisplayMode={setSettingsDisplayMode}
                setEditorTheme={setEditorTheme} />
        </div>
    )
}