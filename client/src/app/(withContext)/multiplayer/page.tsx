import { PLKeys } from "@/app/components/settings/settingsUtils";
import { Question } from "../gameplay/gameplayUtils";
import MultiplayerClient from "./MultiplayerClient";
import styles from './page.module.css';

export default async function Page() {
    // in the real app, load the question and fetch other players' info to pass to multiplayer client
    const question: Question = {
        "qid": 10000000,
        "title": "Two Sum (0)",
        "difficulty": 0,
        "description": [
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n",
            "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n",
            "Arrange the values in your answer in INCREASING order."
        ],
        "input": [
            "Line 1 contains 1 integer, specifying the size n of the nums array.",
            "Line 2 contains n integers, specifying the elements of the array.",
            "Line 3 contains 1 integer, specifying the target."
        ],
        "output": [
            "One line containing two integers, specifying the indices of the pair of numbers whose sum equals the target.",
            "Return the two integers in increasing order."
        ],
        "examples": [
            {
                "input": [
                    "4",
                    "1 3 4 6",
                    "9"
                ],
                "output": [
                    "1 3"
                ],
                "explanation": "Because nums[1] + nums[3] == 7, we print 1 and 3."
            }
        ],
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists"
        ],
        "publicTestCases": [
            {
                "tid": 12345678,
                "input": "4\n2 7 11 15\n9",
                "expectedOutput": "0 1"
            },
            {
                "tid": 12345679,
                "input": "3\n3 2 4\n6",
                "expectedOutput": "1 2"
            },
            {
                "tid": 12345680,
                "input": "2\n3 3\n6",
                "expectedOutput": "0 1"
            },
            {
                "tid": 12345681,
                "input": "4\n1 7 2 9\n16",
                "expectedOutput": "1 3"
            },
            {
                "tid": 12345682,
                "input": "6\n1 2 7 8 12 13\n10",
                "expectedOutput": "1 3"
            },
            {
                "tid": 12345688,
                "input": "4\n2 7 11 15\n9",
                "expectedOutput": "0 1"
            },
            {
                "tid": 12345689,
                "input": "3\n3 2 4\n6",
                "expectedOutput": "1 2"
            },
            {
                "tid": 12345690,
                "input": "2\n3 3\n6",
                "expectedOutput": "0 1"
            },
            {
                "tid": 12345691,
                "input": "4\n1 7 2 9\n16",
                "expectedOutput": "1 3"
            },
            {
                "tid": 12345692,
                "input": "6\n1 2 7 8 12 13\n10",
                "expectedOutput": "1 3"
            }
        ]
    };

    const initialServerData = {
        question: question,
        initialTime: 900,
        activeTab: "duckcode",
        codeByUser: {
            "Team": "// Shared JavaScript\n",
            "duckcode": "// JavaScript 1\n",
            "Player 1": "// JavaScript 2\n",
            "Player 2": "// JavaScript 3\n",
        },
        executionStatusByUser: {
            "Team": "idle",
            "duckcode": "idle",
            "Player 1": "idle",
            "Player 2": "idle",
        },
        programmingLanguage: "JavaScript" as PLKeys,
        readOnlyTabs: ["Player 1", "Player 2"],
    }
    
    return (
        <div className={styles.container}>
            <MultiplayerClient initialServerData={initialServerData} />
        </div>
    )
}