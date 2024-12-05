import './gameplay.css';
import CodeHandler from './CodeHandler';
import GameplayNavbar from './GameplayNavbar';
import Question, { QuestionTemplate } from './Question';

const title = 'Two Sum';
const difficulty = 1000;

const description = [
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
    "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
    "You can return the answer in any order."
].join("\n");

const examples = [
    ['nums = [2, 7, 11, 15], target = 9', '[0, 1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].'],
    ['nums = [3, 2, 4], target = 6', '[1, 2]', null],
    ['nums = [3, 3], target = 6', '[0, 1]', null]
]

const constraint = [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists'
].join('\n');

const testCases = [
    [JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), '[0, 1]'],
    [JSON.stringify({ nums: [3, 2, 4], target: 6 }), '[1, 2]'],
    [JSON.stringify({ nums: [3, 3], target: 6 }), '[0, 1]'],
    [JSON.stringify({ nums: [1, 7, 2, 9], target: 16 }), '[1, 3]'],
    [JSON.stringify({ nums: [1, 2, 7, 8, 12, 13], target: 10 }), '[1, 3]']
];

const dummyQTemplate = new QuestionTemplate(
    title,
    difficulty,
    description,
    examples,
    constraint
);

export default function Gameplay() {
    return (
        <div id="gameplay">
            <GameplayNavbar />
            <Question questionTemplate={ dummyQTemplate } />
            <CodeHandler testCases={testCases} />
        </div>
    )
}