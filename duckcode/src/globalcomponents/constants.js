import Home from "../pages/Landing/landing_components/Home";
import News from "../pages/Landing/landing_components/News";
import CodeEditorSettings from "./settings_components/CodeEditorSettings";
import GeneralSettings from "./settings_components/GeneralSettings";
import KeyboardShortcutSettings from "./settings_components/KeyboardShortcutSettings";
import AccountSettings from "./settings_components/AccountSettings";

/**
 * Object literal of key bindings in the format:
 * [keyBindingFunctionality]: [Functionality]
 */
export const LIST_OF_KEY_BINDINGS = {
    // "Save the current settings": "'CTRL' + 'S'",
    "Revert to the last save.": "'CTRL' + 'Z'",
    "Escape from settings": "'ESC'",
    "Automatically runs the code in output mode.": "'CTRL' + 'Enter'", 
};

const PRISTINE_LIST_OF_KEY_BINDINGS = {
    // "Save the current settings": "'CTRL' + 'S'",
    "Revert to the last save.": "'CTRL' + 'Z'",
    "Escape from settings": "'ESC'",
    "Automatically runs the code in output mode.": "'CTRL' + 'Enter'", 
};

/**
 * Reset the default list of key bindings.
 */
export function resetKeyBindings() {
    for (const key in PRISTINE_LIST_OF_KEY_BINDINGS) {
        LIST_OF_KEY_BINDINGS[key] = PRISTINE_LIST_OF_KEY_BINDINGS[key];
    }
}

/**
 * Object literal of settings options in the format:
 * [ID of the settings option div]: [Name of the settings option the user sees]
 */
export const SETTINGS_OPTIONS = {
    "general-settings": {
        name: "General",
        component: <GeneralSettings />,
    },
    "code-editor-settings": {
        name: "Code Editor",
        component: <CodeEditorSettings />,
    },
    "keyboard-config-settings": {
        name: "Keyboard Shortcut Configuration",
        component: <KeyboardShortcutSettings />
    },
    "account-settings": {
        name: "Account",
        component: <AccountSettings />
    },
};

/**
 * Object literal of token font styles in the format:
 * [string of style passable to IStandaloneThemeData]: [name of the font style]
 */
export const FONT_STYLES = [
    ["italic", "Italic"],
    ["bold", "Bold"],
    ["underline", "Underline"],
    ["strikethrough", "Strikethrough"]
]

/**
 * Object literal of programming languages that DuckCode supports, from PistonAPI
 * Each key-value pair is [progLang]: 
 * {
 *     formal_name (string): The name of the programming language the user will see
 * 
 *     aliases (string[]): The aliases of the language as in Piston API, 
 * 
 *     runtime (string, optional): The runtime of the language as in Piston API, 
 * 
 *     version (string): The version of the language as in Piston API,
 * 
 *     monaco_editor_alias (string, optional): The name to pass into Monaco Editor to set its language.
 * 
 *     code_snippet (string, optional): The initial code snippet that will be shown in the editor when the language is changed.
 * }
 */
export const PROGRAMMING_LANGUAGES = {
    'c': {
        'formal_name': 'C',
        'aliases': ['gcc'], 
        'runtime': 'gcc', 
        'version': '9.2.0', 
        'monaco_editor_alias': 'cpp',
        'code_snippet': '// C code\n'
    },
    'c++': {
        'formal_name': 'C++',
        'aliases': ['cpp', 'g++'], 
        'runtime': 'gcc', 
        'version': '9.2.0', 
        'monaco_editor_alias': 'cpp',
        'code_snippet': '// C++ code\n'
    },
    'csharp': {
        'formal_name': 'C#',
        'aliases': ['mono',
                    'mono-csharp',
                    'mono-c#',
                    'mono-cs',
                    'c#',
                    'cs'],
        'runtime': 'mono',
        'version': '6.6.0.161',
        'monaco_editor_alias': 'csharp',
        'code_snippet': '// C# code\n'
    },
    // 'dart': {
    //     'formal_name': 'Dart',
    //     'aliases': [], 
    //     'version': '2.19.6', 
    //     'monaco_editor_alias': 'dart',
    //     'code_snippet': '// Dart code\n'
    // },
    'elixir': {
        'formal_name': 'Elixir',
        'aliases': ['elixir', 'exs'], 
        'version': '1.9.4', 
        'monaco_editor_alias': 'elixir',
        'code_snippet': '# Elixir code\n'
    },
    'go': {
        'formal_name': 'Go',
        'aliases': ['go', 'golang'], 
        'version': '1.13.5', 
        'monaco_editor_alias': 'go',
        'code_snippet': '// Go code\n'
    },
    'java': {
        'formal_name': 'Java',
        'aliases': [], 
        'version': '13.0.1', 
        'monaco_editor_alias': 'java',
        'code_snippet': '// Java code\n'
    },
    'javascript': {
        'formal_name': 'JavaScript',
        'aliases': ['node-javascript', 'node-js', 'javascript', 'js'],
        'runtime': 'node',
        'version': '12.14.0',
        'monaco_editor_alias': 'javascript',
        'code_snippet': '// JavaScript code\n'
    },
    'kotlin': {
        'formal_name': 'Kotlin',
        'aliases': ['kt'], 
        'version': '1.3.70', 
        'monaco_editor_alias': 'kotlin',
        'code_snippet': '// Kotlin code\n'
    },
    'php': {
        'formal_name': 'PHP',
        'aliases': [], 
        'version': '7.4.1', 
        'monaco_editor_alias': 'php',
        'code_snippet': '// PHP code\n'
    },
    'python': {
        'formal_name': 'Python',
        'aliases': ['py', 'py3', 'python3', 'python3.10'],
        'version': '3.8.1',
        'monaco_editor_alias': 'python',
        'code_snippet': '# Python code\n'
    },
    'ruby': {
        'formal_name': 'Ruby',
        'aliases': ['ruby3', 'rb'], 
        'version': '2.7.0', 
        'monaco_editor_alias': 'ruby',
        'code_snippet': '# Ruby code\n'
    },
    'rust': {
        'formal_name': 'Rust',
        'aliases': ['rs'], 
        'version': '1.40.0', 
        'monaco_editor_alias': 'rust',
        'code_snippet': '// Rust code\n'
    },
    'scala': {
        'formal_name': 'Scala',
        'aliases': ['sc'], 
        'version': '2.13.2', 
        'monaco_editor_alias': 'scala',
        'code_snippet': '// Scala code\n'
    },
    'swift': {
        'formal_name': 'Swift',
        'aliases': ['swift'], 
        'version': '5.2.3', 
        'monaco_editor_alias': 'swift',
        'code_snippet': '// Swift code\n'
    },
    'typescript': {
        'formal_name': 'TypeScript',
        'aliases': ['ts', 'node-ts', 'tsc', 'typescript5', 'ts5'],
        'version': '3.7.4', 
        'monaco_editor_alias': 'typescript',
        'code_snippet': '// TypeScript code\n'
    },
};

/**
 * List of available font families.
 */
// export const FONT_FAMILIES = [
//     'monospace'
// ];

export const FONT_FAMILIES = {
    'monospace': {
        'formal_name': 'Monospace'
    }
}

/**
 * An enum of the different phases of the settings component.
 * 
 * Accessible using the syntax: SETTINGS_PHASES.[SAVE_STATUS].[REVERT_STATUS],
 * where SAVE_STATUS is either CAN_SAVE or CANNOT_SAVE, 
 * and REVERT_STATUS is either CAN_REVERT or CANNOT_REVERT.
 */
export const SETTINGS_STATUS = Object.freeze({
    CAN_SAVE: Object.freeze({
        CAN_REVERT: 0,
        CANNOT_REVERT: 1,
    }),
    CANNOT_SAVE: Object.freeze({
        CAN_REVERT: 2,
        CANNOT_REVERT: 3,
    })
});

/**
 * An object literal of password conditions used in Signup page. 
 * 
 * Each key-value pair is in the form 
 * 
 * [condition] {
 * 
 *     name (str): The condition description the user will see.
 * 
 *     checkFn (function): The function to verify if this condition is achieved.
 * 
 * }
 */
export const PASSWORD_CONDITIONS = {
    hasTenCharOrMore: {
        name: 'At least 10 characters',
        checkFn: str => str.length >= 10
    },
    hasUppercase: {
        name: 'At least 1 uppercase letter',
        checkFn: str => /[A-Z]/.test(str)
    },
    hasLowercase: {
        name: 'At least 1 lowercase letter',
        checkFn: str => /[a-z]/.test(str)
    },
    hasDigit: {
        name: 'At least 1 numerical digit',
        checkFn: str => /\d/.test(str)
    },
    hasSpecialChar: {
        name: 'At least 1 special character: !, @, #, $, %, ^, &, *, ?',
        checkFn: str => /[!@#$%^&*?]/.test(str)
    },
    hasNoSpaces: {
        name: 'No space',
        checkFn: str => !/\s/.test(str)
    }
}

/**
 * An object literal of username conditions used in Signup page. 
 * 
 * Each key-value pair is in the form 
 * 
 * [condition]: {
 * 
 *     name (str): The condition description the user will see.
 * 
 *     checkFn (function): The function to verify if this condition is achieved.
 * 
 * }
 */
export const USERNAME_CONDITIONS = {
    fiveToTwentyCharacters: {
        name: 'Between 5 and 30 characters',
        checkFn: str => str.length >= 5 && str.length <= 30
    },
    containsAllowedChars: {
        name: 'Only contains letters (from any language), numbers, underscores (_), dot (.) or hyphen (-)',
        checkFn: str => /^[\p{L}\p{N}_.-]+$/u.test(str)
    }
}

/**
 * An object literal storing the sections to be displayed in the Landing page.
 * 
 * Each key-value pair is in the form:
 * 
 * [section alias]: {
 * 
 *     name (str): The name of the section the user will see in the navigation bar.
 * 
 *     section (str): The JSX element representing the section.
 * }
 */
export const SECTIONS = {
    "home": {
        name: "Home",
        section: <Home />
    },
    "news": {
        name: "News",
        section: <News />
    }
}

export const LANGUAGE_TO_ID = [
    // {
    //   "id": 45,
    //   "name": "Assembly (NASM 2.14.02)"
    // },
    // {
    //   "id": 46,
    //   "name": "Bash (5.0.0)"
    // },
    // {
    //   "id": 47,
    //   "name": "Basic (FBC 1.07.1)"
    // },
    {
      "id": 50,
      "name": "C"
    },
    {
      "id": 54,
      "name": "C++",
    },
    // {
    //   "id": 86,
    //   "name": "Clojure (1.10.1)"
    // },
    {
      "id": 51,
      "name": "C#",
    },
    // {
    //   "id": 77,
    //   "name": "COBOL (GnuCOBOL 2.2)"
    // },
    // {
    //   "id": 55,
    //   "name": "Common Lisp (SBCL 2.0.0)"
    // },
    // {
    //   "id": 56,
    //   "name": "D (DMD 2.089.1)"
    // },
    {
      "id": 57,
      "name": "Elixir"
    },
    // {
    //   "id": 58,
    //   "name": "Erlang (OTP 22.2)"
    // },
    // {
    //   "id": 44,
    //   "name": "Executable"
    // },
    // {
    //   "id": 87,
    //   "name": "F# (.NET Core SDK 3.1.202)"
    // },
    // {
    //   "id": 59,
    //   "name": "Fortran (GFortran 9.2.0)"
    // },
    {
      "id": 60,
      "name": "Go"
    },
    // {
    //   "id": 88,
    //   "name": "Groovy (3.0.3)"
    // },
    // {
    //   "id": 61,
    //   "name": "Haskell (GHC 8.8.1)"
    // },
    {
      "id": 62,
      "name": "Java"
    },
    {
      "id": 63,
      "name": "JavaScript"
    },
    {
      "id": 78,
      "name": "Kotlin"
    },
    // {
    //   "id": 64,
    //   "name": "Lua (5.3.5)"
    // },
    // {
    //   "id": 89,
    //   "name": "Multi-file program"
    // },
    // {
    //   "id": 79,
    //   "name": "Objective-C (Clang 7.0.1)"
    // },
    // {
    //   "id": 65,
    //   "name": "OCaml (4.09.0)"
    // },
    // {
    //   "id": 66,
    //   "name": "Octave (5.1.0)"
    // },
    // {
    //   "id": 67,
    //   "name": "Pascal (FPC 3.0.4)"
    // },
    // {
    //   "id": 85,
    //   "name": "Perl (5.28.1)"
    // },
    {
      "id": 68,
      "name": "PHP"
    },
    // {
    //   "id": 43,
    //   "name": "Plain Text"
    // },
    // {
    //   "id": 69,
    //   "name": "Prolog (GNU Prolog 1.4.5)"
    // },
    {
      "id": 71,
      "name": "Python"
    },
    // {
    //   "id": 80,
    //   "name": "R (4.0.0)"
    // },
    {
      "id": 72,
      "name": "Ruby"
    },
    {
      "id": 73,
      "name": "Rust"
    },
    {
      "id": 81,
      "name": "Scala"
    },
    // {
    //   "id": 82,
    //   "name": "SQL (SQLite 3.27.2)"
    // },
    {
      "id": 83,
      "name": "Swift"
    },
    {
      "id": 74,
      "name": "TypeScript"
    },
    // {
    //   "id": 84,
    //   "name": "Visual Basic.Net (vbnc 0.0.0.5943)"
    // }
].reduce((acc, { id, name }) => {
    acc[name] = id;
    return acc;
}, {});


export const STATUS_ID_TO_SUBMISSION_MESSAGE = {
    1: "Accepted",
    2: "Compile Error",
    3: "Runtime Error",
    4: "Time Limit Exceeded",
    5: "Wrong Answer"
}

export const GAMEPLAY_API_HTTP = 'http://52.63.69.143'
export const GAMEPLAY_API_HTTPS = 'https://cors-anywhere.herokuapp.com/' + GAMEPLAY_API_HTTP