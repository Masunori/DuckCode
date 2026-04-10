import { EncodeSchema, UserPreference, Version } from "./userPrefsTypes";
import * as v0_1_0 from "./versions/v0_1_0";
import * as v0_1_1 from "./versions/v0_1_1";

/**
 * Schema defining how to encode user preferences for different versions.
 * 
 * For each version, the encode function **only** includes fields newly introduced in that version.
 */
export const USER_PREF_SCHEMA = [
    {
        version: "0.1.0",
        encode: v0_1_0.encode,
        decode: v0_1_0.decode,
        default: v0_1_0.PRISTINE,
    },
    {
        version: "0.1.1",
        encode: v0_1_1.encode,
        decode: v0_1_1.decode,
        default: v0_1_1.PRISTINE,
    }
] as const satisfies EncodeSchema<UserPreference>;

export const VERSION_ORDER: Version[] = USER_PREF_SCHEMA.map(s => s.version);
export const LATEST_VERSION: Version = VERSION_ORDER.at(-1)!;
