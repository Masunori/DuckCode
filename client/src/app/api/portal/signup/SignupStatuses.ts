export enum SignupStatuses {
    USERNAME_TAKEN, // if the username is already taken
    EMAIL_USED, // if the email is already used
    INVALID_USERNAME, // if the username is invalid
    INVALID_EMAIL, // if the email is invalid
    INVALID_PASSWORD, // if the password is invalid
    MISMATCH_CONFIRM_PASSWORD // if the confirm password does not match the password
}