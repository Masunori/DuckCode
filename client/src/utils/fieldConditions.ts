type Condition = {
    name: string;
    checkFn: (password: string) => boolean;
}

export enum FieldState {
    EMPTY,
    VALID,
    INVALID,
    SERVER_SIDE_INVALID
}

export const PASSWORD_CONDITIONS: Record<string, Condition> = {
    hasTenCharOrMore: {
        name: 'At least 10 characters',
        checkFn: str => str.length >= 10
    },
    hasUppercase: {
        name: 'At least 1 uppercase letter',
        checkFn: str => /[A-Z]/.test(str)
    },
    hasLowercase: {
        name: 'At least 1 lowercase letter',
        checkFn: str => /[a-z]/.test(str)
    },
    hasDigit: {
        name: 'At least 1 numerical digit',
        checkFn: str => /\d/.test(str)
    },
    hasSpecialChar: {
        name: 'At least 1 special character: !, @, #, $, %, ^, &, *, ?',
        checkFn: str => /[!@#$%^&*?]/.test(str)
    },
    hasNoSpaces: {
        name: 'No space',
        checkFn: str => !/\s/.test(str)
    }
}

export const USERNAME_CONDITIONS: Record<string, Condition> = {
    fiveToTwentyCharacters: {
        name: 'Between 5 and 30 characters',
        checkFn: str => str.length >= 5 && str.length <= 30
    },
    containsAllowedChars: {
        name: 'Only contains letters (from any language), numbers, underscores (_), dot (.) or hyphen (-)',
        checkFn: str => /^[\p{L}\p{N}_.-]+$/u.test(str)
    }
}