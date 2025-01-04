/**
 * Object literal of key bindings in the format:
 * [keyBindingFunctionality]: [Functionality]
 */
export const LIST_OF_KEY_BINDINGS = {
    "Save the current settings": "'CTRL' + 'S'",
    "Revert to the last save.": "'CTRL' + 'Z'",
    "Escape from settings": "'ESC'",
    "Automatically runs the code in output mode.": "'CTRL' + 'Enter'", 
};

const PRISTINE_LIST_OF_KEY_BINDINGS = {
    "Save the current settings": "'CTRL' + 'S'",
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
    "general-settings": "General",
    "code-editor-settings": "Code Editor",
    "keyboard-config-settings": "Keyboard Shortcut Configuration",
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
 *     aliases (string[]): ___, 
 *     runtime (string, optional): ___, 
 *     version (string): ___,
 *     monaco_editor_alias (string, optional): ___
 *     code_snippet (string, optional): ___
 * }
 */
export const PROGRAMMING_LANGUAGES = {
    'c': {
        'aliases': ['gcc'], 
        'runtime': 'gcc', 
        'version': '10.2.0', 
        'monaco_editor_alias': 'cpp',
        'code_snippet': '// C code\n'
    },
    'c++': {
        'aliases': ['cpp', 'g++'], 
        'runtime': 'gcc', 
        'version': '10.2.0', 
        'monaco_editor_alias': 'cpp',
        'code_snippet': '// C++ code\n'
    },
    'csharp': {'aliases': ['mono',
                        'mono-csharp',
                        'mono-c#',
                        'mono-cs',
                        'c#',
                        'cs'],
            'runtime': 'mono',
            'version': '6.12.0',
            'monaco_editor_alias': 'csharp',
            'code_snippet': '// C# code\n'
    },
    'dart': {
        'aliases': [], 
        'version': '2.19.6', 
        'monaco_editor_alias': 'dart',
        'code_snippet': '// Dart code\n'
    },
    'elixir': {
        'aliases': ['elixir', 'exs'], 
        'version': '1.11.3', 
        'monaco_editor_alias': 'elixir',
        'code_snippet': '# Elixir code\n'
    },
    'go': {
        'aliases': ['go', 'golang'], 
        'version': '1.16.2', 
        'monaco_editor_alias': 'go',
        'code_snippet': '// Go code\n'
    },
    'java': {
        'aliases': [], 
        'version': '15.0.2', 
        'monaco_editor_alias': 'java',
        'code_snippet': '// Java code\n'
    },
    'javascript': {
        'aliases': ['node-javascript', 'node-js', 'javascript', 'js'],
        'runtime': 'node',
        'version': '18.15.0',
        'monaco_editor_alias': 'javascript',
        'code_snippet': '// JavaScript code\n'
    },
    'kotlin': {
        'aliases': ['kt'], 
        'version': '1.8.20', 
        'monaco_editor_alias': 'kotlin',
        'code_snippet': '// Kotlin code\n'
    },
    'php': {
        'aliases': [], 
        'version': '8.2.3', 
        'monaco_editor_alias': 'php',
        'code_snippet': '// PHP code\n'
    },
    'python': {
        'aliases': ['py', 'py3', 'python3', 'python3.10'],
        'version': '3.10.0',
        'monaco_editor_alias': 'python',
        'code_snippet': '# Python code\n'
    },
    'ruby': {
        'aliases': ['ruby3', 'rb'], 
        'version': '3.0.1', 
        'monaco_editor_alias': 'ruby',
        'code_snippet': '# Ruby code\n'
    },
    'rust': {
        'aliases': ['rs'], 
        'version': '1.68.2', 
        'monaco_editor_alias': 'rust',
        'code_snippet': '// Rust code\n'
    },
    'scala': {
        'aliases': ['sc'], 
        'version': '3.2.2', 
        'monaco_editor_alias': 'scala',
        'code_snippet': '// Scala code\n'
    },
    'swift': {
        'aliases': ['swift'], 
        'version': '5.3.3', 
        'monaco_editor_alias': 'swift',
        'code_snippet': '// Swift code\n'
    },
    'typescript': {
        'aliases': ['ts', 'node-ts', 'tsc', 'typescript5', 'ts5'],
        'version': '5.0.3', 
        'monaco_editor_alias': 'typescript',
        'code_snippet': '// TypeScript code\n'
    },
};

/**
 * List of available font families.
 */
export const FONT_FAMILIES = [
    'monospace'
];

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

