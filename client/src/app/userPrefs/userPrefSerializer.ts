import { UserPreference, Version } from "./userPrefsTypes";
import { LATEST_VERSION, USER_PREF_SCHEMA } from "./userPrefRegistry";

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
export function compareVersions(version1: string, version2: string): number {
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
 * Encodes the user preference using the latest schema into a JSON string.
 * 
 * @param pref The user preference to encode.
 * @returns The JSON string representation of the encoded user preference.
 */
export function encodeUserPreference(pref: UserPreference): string {
    const payload = Object.assign(
        {},
        ...USER_PREF_SCHEMA.map(s => s.encode(pref))
    );

    return JSON.stringify({ version: LATEST_VERSION, data: payload });
}

/**
 * Decodes the user preference from a JSON string.
 * 
 * @param raw 
 * @returns 
 */
export function decodeUserPreference(raw: string): UserPreference {
    const parsed = JSON.parse(raw) as { version: Version; data: any; };
    const result: Partial<UserPreference> = {};
    
    for (const schema of USER_PREF_SCHEMA) {
        Object.assign(
            result,
            schema.decode(parsed.data)
        );
    }

    return result as UserPreference;
}