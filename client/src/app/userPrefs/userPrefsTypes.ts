import type { Fragment as V1_0_0Fragment } from "./versions/v0_1_0";
import type { Fragment as V1_1_0Fragment } from "./versions/v0_1_1";

export type Version = `${number}.${number}.${number}`;

export type EditorOptions = {
    theme: string;
    enableMinimap: boolean;
    lineNumbers: string;
    renderWhiteSpace: string;
    tabSize: number;
    wordWrap: string;
    wordWrapColumn: number;
}

export type UserPreference =
    V1_0_0Fragment &
    V1_1_0Fragment;

export type UserPreferenceAddOn = {
    version?: Version;
    decode?: () => void;
}

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    level: number;
    exp: number;
    rank: string;
    rankPoint: number;
    bio: string;
    createdAt: string;
    isTwoFactored: boolean;
    profilePicture: string;
}

export type Encoder<T> = (value: T) => string | number;
export type Decoder<T> = (encoded: string) => T;
export type PrefSchemaEntry<T> = {
    get: (pref: any) => T;
    set?: (pref: any, value: T) => void;
    encode?: Encoder<T>;
    decode?: Decoder<T>;
};

/** A schema entry that defines how to encode and decode specific attributes introduced in that version */
export type EncodeSchemaEntry<T, F> = {
    /** The version of the schema entry */
    version: Version;
    /** Function to encode the relevant fields from the user preference */
    encode: (pref: T) => Partial<F>;
    /** Function to decode the relevant fields into the user preference */
    decode: (raw: any) => F;
    /** The default fragment for this schema entry */
    default: F;
}

export type EncodeSchema<T> = readonly EncodeSchemaEntry<T, any>[];
