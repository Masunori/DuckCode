import { FieldState } from "@/lib/utils/fieldConditions"

/**
 * Indicator colors for input fields. Used to indicate the state of (primarily text) input fields,
 * such as username, password, email, etc., where:
 * 
 * - **Empty string**: The input field is empty.
 * - **Invalid string**: The input field contains an invalid value verifiable on the client (e.g., wrong format, fails validation).
 * - **Valid string**: The input field passes all client-side validation.
 * - **Server-side error**: The input field's value is valid on the client, but there was an error when processing it on the server (e.g., username already taken).
 */
export enum InputIndicatorColours {
    // These colors are used for the borders (and possibly text) of input fields to indicate their state (empty, invalid, valid, server-side error).
    EMPTY_STRING_BORDER = '#888',
    INVALID_STRING_BORDER = '#DC143C',
    VALID_STRING_BORDER = '#00FF00',
    SERVER_SIDE_ERROR_BORDER = '#FF5C00',

    // These colors are used for the background of input fields to indicate their state (empty, invalid, valid, server-side error).
    EMPTY_STRING_BG = 'var(--second-layer-background-color)',
    INVALID_STRING_BG = '#540A1E',
    VALID_STRING_BG = '#008800',
    SERVER_SIDE_ERROR_BG = '#7C1212',
}

/**
 * Border colors for input fields based on their state (empty, valid, invalid, server-side invalid). These mappings are used to dynamically style input fields in the authentication forms (e.g., username and password inputs) to provide visual feedback to users about the validity of their input.
 */
export const fieldBorderColors = {
    [FieldState.EMPTY]: InputIndicatorColours.EMPTY_STRING_BORDER,
    [FieldState.VALID]: InputIndicatorColours.VALID_STRING_BORDER,
    [FieldState.INVALID]: InputIndicatorColours.INVALID_STRING_BORDER,
    [FieldState.SERVER_SIDE_INVALID]: InputIndicatorColours.SERVER_SIDE_ERROR_BORDER
}

/**
 * Background colors for input fields based on their state (empty, valid, invalid, server-side invalid). These mappings are used to dynamically style the background of input fields in the authentication forms to provide visual feedback to users about the validity of their input.
 */
export const fieldBackgroundColors = {
    [FieldState.EMPTY]: InputIndicatorColours.EMPTY_STRING_BG,
    [FieldState.VALID]: InputIndicatorColours.VALID_STRING_BG,
    [FieldState.INVALID]: InputIndicatorColours.INVALID_STRING_BG,
    [FieldState.SERVER_SIDE_INVALID]: InputIndicatorColours.SERVER_SIDE_ERROR_BG
}