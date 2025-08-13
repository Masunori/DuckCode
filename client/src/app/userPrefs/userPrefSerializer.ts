import { ID_TO_PLKEY, PROGRAMMING_LANGUAGES } from "../components/settings/settingsUtils";
import { userPreference } from "./userPrefsUtils";

const VERSION = "1.0.0";

const themesToEncoded: Record<string, number> = {
    "Visual Studio - Dark": 0,
    "Visual Studio - Light": 1,
    "High Contrast - Dark": 2,
    "High Contrast - Light": 3,
}

const encodedToThemes: string[] = [
    "Visual Studio - Dark",
    "Visual Studio - Light",
    "High Contrast - Dark",
    "High Contrast - Light",
]

const lineNumbersToEncoded: Record<string, number> = {
    "On": 0,
    "Off": 1,
    "Relative": 2,
    "Interval": 3
}

const encodedToLineNumbers: string[] = [
    "On",
    "Off",
    "Relative",
    "Interval"
]

const renderWhiteSpaceToEncoded: Record<string, number> = {
    "All": 0,
    "None": 1,
    "Boundary": 2,
    "Selection": 3,
    "Trailing": 4
}

const encodedToRenderWhiteSpace: string[] = [
    "All",
    "None",
    "Boundary",
    "Selection",
    "Trailing"
]

const wordWrapToEncoded: Record<string, number> = {
    "On": 0,
    "Off": 1,
    "Word Wrap Column": 2,
    "Bounded": 3
}

const encodedToWordWrap: string[] = [
    "On",
    "Off",
    "Word Wrap Column",
    "Bounded"
]

const gameplayLayoutsToEncoded: Record<string, number> = {
    "Default": 0,
    "Inverted": 1,
    "Two Tabs": 2,
    "Two Tabs Inverted": 3,
    "Fullscreen Editor": 4,
}

const encodedToGameplayLayouts: string[] = [
    "Default",
    "Inverted",
    "Two Tabs",
    "Two Tabs Inverted",
    "Fullscreen Editor",
];

/**
 * Compares two version strings in the format "major.minor.patch".
 * 
 * @param version1 The target version string to compare.
 * @param version2 The version string to compare against.
 * @returns A negative number if version1 < version2, a positive number if version1 > version2, or 0 if they are equal.
 */
function compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const part1 = v1Parts[i] || 0; // Default to 0 if part is missing
        const part2 = v2Parts[i] || 0; // Default to 0 if part is missing

        if (part1 < part2) return -1;
        if (part1 > part2) return 1;
    }
    return 0; // Versions are equal
}

/**
 * Encodes a userPreference object into a lightweight string representation.
 * Encoding will always default to the latest version.
 * 
 * @param userPref userPreference object to encode
 * @returns The encoded string representation of the user preferences.
 */
export function encodeUserPrefs(userPref: userPreference): string {
    return [
        VERSION,
        userPref.fontSize,
        PROGRAMMING_LANGUAGES[userPref.language],
        userPref.significantButtonColor,
        userPref.significantButtonHoverColor,
        gameplayLayoutsToEncoded[userPref.gameplayLayout],
        themesToEncoded[userPref.editorOptions.theme],
        userPref.editorOptions.enableMinimap ? 1 : 0,
        lineNumbersToEncoded[userPref.editorOptions.lineNumbers],
        renderWhiteSpaceToEncoded[userPref.editorOptions.renderWhiteSpace],
        userPref.editorOptions.tabSize,
        wordWrapToEncoded[userPref.editorOptions.wordWrap],
        userPref.editorOptions.wordWrapColumn,
    ].join(",");
}

/**
 * Decodes a lightweight string representation of user preferences into a userPreference object.
 * @param encodedPrefs The encoded string representation of user preferences.
 * @returns The decoded userPreference object.
 * @throws Will throw an error if the encoded string is invalid or unsupported.
 */
export function decodeUserPrefs(encodedPrefs: string): userPreference {
    const parts = encodedPrefs.split(",");
    if (parts.length < 12) {
        throw new Error("Invalid user preference encoding.");
    }

    const version = parts[0];
    if (compareVersions(version, VERSION) > 0) {
        throw new Error("Unsupported user preference version.");
    }

    return {
        fontSize: parseInt(parts[1], 10),
        language: ID_TO_PLKEY[parseInt(parts[2], 10)],
        significantButtonColor: parts[3],
        significantButtonHoverColor: parts[4],
        gameplayLayout: encodedToGameplayLayouts[parseInt(parts[5], 10)],
        editorOptions: {
            theme: encodedToThemes[parseInt(parts[6], 10)],
            enableMinimap: parts[7] === "1",
            lineNumbers: encodedToLineNumbers[parseInt(parts[8], 10)],
            renderWhiteSpace: encodedToRenderWhiteSpace[parseInt(parts[9], 10)],
            tabSize: parseInt(parts[10], 10),
            wordWrap: encodedToWordWrap[parseInt(parts[11], 10)],
            wordWrapColumn: parseInt(parts[12], 10),
        }
    };
}