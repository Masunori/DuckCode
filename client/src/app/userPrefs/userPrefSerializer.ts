import { UserPreference, Version } from "./userPrefsTypes";
import { LATEST_VERSION, USER_PREF_SCHEMA } from "./userPrefRegistry";

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
 * @param raw The raw JSON string containing the version and data of the user preference.
 * @returns The decoded user preference object.
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