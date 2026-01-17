import { decodeUserPreference, encodeUserPreference } from "./userPrefSerializer";
import { UserPreference } from "./userPrefsTypes";

export const USER_PREF_KEY = "duckcode_user_preference";

/**
 * Saves user preference to local storage.
 * @param pref The user preference to save.
 */
export function saveUserPreference(pref: UserPreference): void {
    const encoded = encodeUserPreference(pref);
    localStorage.setItem(USER_PREF_KEY, encoded);
}

/**
 * Loads user preference from local storage.
 * @returns the loaded user preference, or null if not found or corrupted.
 */
export function loadUserPreference(): UserPreference | null {
    const raw = localStorage.getItem(USER_PREF_KEY);

    if (!raw) {
        return null;
    }

    try {
        return decodeUserPreference(raw);
    } catch {
        return null; // corrupted data
    }
}

/**
 * Clears the user preference from local storage.
 */
export function clearUserPreference(): void {
    localStorage.removeItem(USER_PREF_KEY);
}