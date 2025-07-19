export enum SignupStatuses {
    USERNAME_TAKEN, // if the username is already taken
    EMAIL_USED, // if the email is already used
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone bypasses client-side validation
}