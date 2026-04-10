import { decodeUserPreference, encodeUserPreference } from "./userPrefSerializer";
import { UserPreference } from "./userPrefsTypes";

// export const USER_PREF_KEY = "duckcode_user_preference";

/**
 * Saves user preference to local storage.
 * @param pref The user preference to save.
 * @param key The key under which to save the preference.
 */
export function saveUserPreference(pref: UserPreference, key: string): void {
    const encoded = encodeUserPreference(pref);
    localStorage.setItem(key, encoded);
}

/**
 * Loads user preference from local storage.
 * @param key The key from which to load the preference.
 * @returns the loaded user preference, or null if not found or corrupted.
 */
export function loadUserPreference(key: string): UserPreference | null {
    const raw = localStorage.getItem(key);

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
 * @param key The key under which the preference is saved.
 */
export function clearUserPreference(key: string): void {
    localStorage.removeItem(key);
}