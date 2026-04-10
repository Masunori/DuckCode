import { PLKeys } from "@/components/settings/settingsUtils";
import * as monaco from 'monaco-editor';
import { UserPreference, Version, User } from "./userPrefsTypes";
import { USER_PREF_SCHEMA } from "./userPrefRegistry";

/**
 * Compares two version strings, according to the rules of semantic versioning.
 * @param v1 The first version string.
 * @param v2 The second version string.
 * @returns A negative number if v1 < v2, a positive number if v1 > v2, or 0 if they are equal.
 */
export function compareVersions(v1: Version, v2: Version): number {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (v1Parts[i] < v2Parts[i]) return -1;
        if (v1Parts[i] > v2Parts[i]) return 1;
    }

    return 0;
}

export const LINE_NUMBERS_OPTIONS: Record<string, monaco.editor.LineNumbersType> = {
    "On": "on",
    "Off": "off",
    "Relative": "relative",
    "Interval": "interval"
}

export const RENDER_WHITESPACE_OPTIONS: Record<string, "all" | "none" | "boundary" | "selection" | "trailing" | undefined> = {
    "All": "all",
    "None": "none",
    "Boundary": "boundary",
    "Selection": "selection",
    "Trailing": "trailing"
}

export const WORD_WRAP_OPTIONS: Record<string, "on" | "off" | "wordWrapColumn" | "bounded" | undefined> = {
    "On": "on",
    "Off": "off",
    "Word Wrap Column": "wordWrapColumn",
    "Bounded": "bounded"
}

export const PRISTINE_USER_PREFERENCE: UserPreference = {
    fontSize: 16,
    language: "JavaScript",
    significantButtonColor: '#007fff',
    significantButtonHoverColor: '#0560bc',
    gameplayLayout: "Default",
    editorOptions : {
        theme: "Visual Studio - Dark",
        enableMinimap: true,
        lineNumbers: "On",
        renderWhiteSpace: "None",
        tabSize: 4,
        wordWrap: "Off",
        wordWrapColumn: 80,
    },
    colorAccessibilityMode: "Normal",
    displayKeyBindingOnButtons: true,
}

export const PRISTINE_USER: User = {
    id: 1,
    name: "duckcode",
    email: "iloveduckcode@gmail.com",
    password: "Dmd1281990!",
    level: 1,
    exp: 0,
    rank: "Rookie",
    rankPoint: 1000,
    bio: "Welcome to my DuckCode profile!",
    createdAt: "2023-01-01T00:00:00Z",
    isTwoFactored: false,
    profilePicture: "/default-profile.png", // Update with a default profile picture path
}

export function getDefaultUserPreference(): UserPreference {
    const defaultUserPreference: Partial<UserPreference> = {};

    for (const schemaEntry of USER_PREF_SCHEMA) {
        Object.assign(defaultUserPreference, structuredClone(schemaEntry.default));
    }

    return defaultUserPreference as UserPreference;
}

/*
    Settings to consider:

    1. GENERAL SETTINGS
        - Auto-save permission
        - Auto-save frequency

    2. VISUAL SETTINGS (hover has "auto" option that calculate the best hover color)
        2.1. GENERAL
        - Button color (normal + hover)

        2.2. CODE EDITOR
        - Code editor theme (need matching UI too) - can enable Colorblind-friendly palette mode
        - Programming language
        - Font size (fontSize option)
        - Font family (fontFamily option) - can enable Dyslexia-friendly fonts (fontFamily: "OpenDyslexic")
        - Line spacing (lineHeight option)
        - Color scheme / Syntax highlighting 
        - UI scaling / Zoom
        - Code minimap toggle (minimap: { enabled: true/false })
        - Linting on/off (built-in for TS/JS, needs configuration for other languages)
        - Code templates/snippets (supported by Monaco Editor)
        - Line numbering (lineNumbers: "on" / "off")
        - Error highlighting level (available for TS/JS, limited per language)

        2.3. OUTPUT AND TEST CASES 
        - Error output color
        - Successful public test case selector background color (normal + hover)
        - Failed public test case selector background color (normal + hover)
        - Successful test case display background + border color (normal + hover)
        - Failed test case display background + border color (normal + hover)

    3. KEYBOARD SHORTCUT CONFIGURATION
        - Remappable key bindings

    4. ACCOUNT
    
        4.1. BASIC
        - Change username
        - Change/Remove profile picture
        - Bio/personal info (optional)
        - View email, level, rank... 

        4.2. PASSWORD AND SECURITY
        - Change password
        - Recovery options (backup email/phone number...)
        - Manage active sessions (log out other devices)
        - Manage 2FA

        4.3. LOGIN AND AUTHENTICATION
        - Add/Change/Unlink third-party login
        - Change binding email

        4.4. PRIVACY SETTINGS
        - Who can see profile info, play history
        - Show/Hide online status
        - Allow friend invites/team invites
        - Block/Report players
        
        4.5. NOTIFICATIONS
        - Allow email notifications
        - Allow push notifications
        - Set specific events notification (mentions, messages, updates...)

        4.6. ACCOUNT MANAGEMENT
        - Delete account (with warnings)
        - Download account data (for GDPR compliance)
        - Export/Import settings or preferences

    5. MULTIPLAYER SETTINGS
    - Voice messages (volume...)
    - Text messages
    - Show code to other team

    6. CHAT
    - Private Messaging
    - Chat to World
    - Chat to Dev Team
*/