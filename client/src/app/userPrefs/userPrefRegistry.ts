import { EncodeSchema, UserPreference, Version } from "./userPrefsTypes";
import * as v1_0_0 from "./versions/v1_0_0";
import * as v1_1_0 from "./versions/v1_1_0";

/**
 * Schema defining how to encode user preferences for different versions.
 * 
 * For each version, the encode function **only** includes fields newly introduced in that version.
 */
export const USER_PREF_SCHEMA = [
    {
        version: "1.0.0",
        encode: v1_0_0.encode,
        decode: v1_0_0.decode,
        default: v1_0_0.PRISTINE,
    },
    {
        version: "1.1.0",
        encode: v1_1_0.encode,
        decode: v1_1_0.decode,
        default: v1_1_0.PRISTINE,
    }
] as const satisfies EncodeSchema<UserPreference>;

export const VERSION_ORDER: Version[] = USER_PREF_SCHEMA.map(s => s.version);
export const LATEST_VERSION: Version = VERSION_ORDER.at(-1)!;
