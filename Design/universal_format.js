// fetch question
const QUESTION_REQUEST = {
    difficulty: 1000, // int
}

const QUESTION_RESPONSE = {
    qid: 10000000, // int
    title: 'Title', // string
    difficulty: 1000, // int
    description: [
        'description_1',
        'description_2',
        'description_3'
    ], // string array
    input: [
        'input_1',
        'input_2',
        'input_3'
    ], // string array
    output: [
        'output_1',
        'output_2',
        'output_3'
    ], // string array
    examples: [ // JSON object array
        {
            input: [], // string array
            output: [], // string array
            explanation: 'Explanation' // string
        }
    ],
    constraints: [], // string array
    publicTestCases: [ // JSON object array
        {
            tid: 12345678,
            input: '', // string with \n as delimiter
            expectedOutput: '', // string with \n as delimiter
        }
    ]
}

// submit & run code
const SUBMISSION_REQUEST = {
    qid: 10000000, // int
    sourceCode: '// hello world', // string
    languageId: 'javascript', // string
}

/*
    1: accepted
    2: compile error
    3: runtime error
    4: TLE
    5: wrong answer
*/

const RUN_TEST_CASE_RESPONSE = [ // JSON object array
    {
        tid: 12345678, // int
        actualOutput: '', // string with \n as delimiter
        statusId: 1, // int
        message: 'something...', // string if there is compile/runtime error, else null
    }
]

const SUBMISSION_RESPONSE = {
    correct: 69, // int
    total: 420, // int
    statusId: 1, // int
}

// run code in output mode
const RUN_CODE_REQUEST = {
    sourceCode: '// hello world', // string
    language: 'javascript', // string
}

const RUN_CODE_RESPONSE = {
    status: "", // 'success' or 'error'
    output: "", // string
}

// Currently RUN_CODE_RESPONSE is of the format:
const RUN_CODE_RESPONSE_2 = {
    success: true, // boolean
    results: {
        compile_output: "", // string
        memory: 0, // int
        message: "", // string
        'status': {
            id: 0, // int
            description: 'Accepted' // string
        },
        stderr: "", // string
        stdout: "", // string
        time: "0.00", // string
        token: "", // string
    }
}

const USER_RESPONSE = {
    userId: '12345678',
    username: 'duck_administrator_420',
    email: 'iloveduckcode@duckcode.org',
    rankPoints: 1000,
    profile: {
        // avatar: 'https://i.pinimg.com/736x/55/1e/9a/551e9ad6616917d8335fe46db64688b9.jpg',
        level: 38,
        exp: 1200,
    },
    settings: {
        theme: {
            base: "vs-dark",
            inherit: "false",
            rules: [
                { token: 'comment', foreground: '', background: '', fontStyle: '' },
                { token: 'string', foreground: '', background: '', fontStyle: '' },
                { token: 'keyword', foreground: '', background: '', fontStyle: '' },
                { token: 'invalid', foreground: '', background: '', fontStyle: '' },
                { token: 'number', foreground: '', background: '', fontStyle: '' },
                { token: 'number.hex', foreground: '', background: '', fontStyle: '' },
                { token: 'regexp', foreground: '', background: '', fontStyle: '' },
                { token: 'annotation', foreground: '', background: '', fontStyle: '' },
                { token: 'type', foreground: '', background: '', fontStyle: '' },
                { token: 'typeParameter', foreground: '', background: '', fontStyle: '' },
                { token: 'function', foreground: '', background: '', fontStyle: '' },
                { token: 'method', foreground: '', background: '', fontStyle: '' },
                { token: 'macro', foreground: '', background: '', fontStyle: '' },
                { token: 'interface', foreground: '', background: '', fontStyle: '' },
                { token: 'property', foreground: '', background: '', fontStyle: '' },
                { token: 'decorator', foreground: '', background: '', fontStyle: '' },
            ],
            color: {
                'editor.background': '',
                'editor.foreground': '',
                'editorLineNumber.foreground': '',

                'editor.selectionBackground': '',
                'editor.selectionHighlightBackground': '',
                'editor.foldBackground': '',

                'editor.wordHighlightBackground': '',
                'editor.wordHighlightStrongBackground': '',

                'editor.findMatchBackground': '',
                'editor.findMatchHighlightBackground': '',
                'editor.findRangeHighlightBackground': '',

                'editor.hoverHighlightBackground': '',

                'editor.lineHighlightBorder': '',
                'editorLink.activeForeground': '',
                'editor.rangeHighlightBackground': '',
                'editor.snippetTabstopHighlightBackground': '',
                'editor.snippetTabstopHighlightBorder': '',
                'editor.snippetFinalTabstopHighlightBackground': '',
                'editor.snippetFinalTabstopHighlightBorder': '',
                'editorWhitespace.foreground': '',
                'editorIndentGuide.background': '',
                'editorIndentGuide.activeBackground': '',
                'editorRuler.foreground': '',

                'editorCodeLens.foreground': '',

                'editorBracketHighlight.foreground1': '',
                'editorBracketHighlight.foreground2': '',
                'editorBracketHighlight.foreground3': '',
                'editorBracketHighlight.foreground4': '',
                'editorBracketHighlight.foreground5': '',
                'editorBracketHighlight.foreground6': '',
                'editorBracketHighlight.unexpectedBracket.foreground': '',

                'editorOverviewRuler.border': '',
                'editorOverviewRuler.selectionHighlightForeground': '',
                'editorOverviewRuler.wordHighlightForeground': '',
                'editorOverviewRuler.wordHighlightStrongForeground': '',
                'editorOverviewRuler.modifiedForeground': '',
                'editorOverviewRuler.addedForeground':    '',
                'editorOverviewRuler.deletedForeground':  '',
                'editorOverviewRuler.errorForeground':    '',
                'editorOverviewRuler.warningForeground':  '',
                'editorOverviewRuler.infoForeground':     '',

                'editorError.foreground': '',
                'editorWarning.foreground': '',

                'editorGutter.modifiedBackground': '',
                'editorGutter.addedBackground':    '',
                'editorGutter.deletedBackground':  '',

                'sideBar.background': '',
                'sideBarTitle.foreground': '',
                'sideBarSectionHeader.background': '',
                'sideBarSectionHeader.border': '',

                'minimap.background': '',
                'minimap.foregroundOpacity': '',
                'scrollbarSlider.background': ''
            }
        },
        progLang: 'javascript',
        codeEditorFont: 'monospace',
        overallTheme: {
            background: {
                type: 'color',
                value: '#121212',
            },
            firstLayerBackground: {
                type: 'color',
                value: '#242424',
            },
            secondLayerBackground: {
                type: 'color',
                value: '#484848',
            },
            thirdLayerBackground: {
                type: 'color',
                value: '#525252',
            },
            fourthLayerBackground: {
                type: 'color',
                value: '#606060',
            },
            significantChoiceButton: {
                type: 'color',
                value: '#0077ff',
            },
            significantChoiceButtonSelected: {
                type: 'color',
                value: '#0560bc',
            },
            insignificantChoiceButton: {
                type: 'color',
                value: '#363636',
            },
            insignificantChoiceButtonSelected: {
                type: 'color',
                value: '#484848',
            },
            settingsBackground: {
                type: 'color',
                value: '#484848',
            },
            settingsOptionBackground: {
                type: 'color',
                value: '#363636',
            },
            settingsOptionBorder: {
                type: 'color',
                value: '#848484',
            },
            overallFont: {
                type: 'dropdown',
                value: "'PF Din Text Pro', 'sans-serif'",
            }, 
        }  
    }
};

// no need to check for valid format
const USER_LOGIN_REQUEST = {
    username: "duck", // string
    password: "duck", // string
}

// must check for valid username and password
const USER_SIGNUP_REQUEST = {
    username: "duck", // string
    password: "duck", // string
    confirmPassword: "duck",
    email: "", // string
}


// if successful sign-up, must return status = "SUCCESS"
// else, return the reason for failure 
const USER_SIGNUP_STATUS = {
    status: "", // string
}
