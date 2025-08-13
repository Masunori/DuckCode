export enum ResetPasswordStatuses {
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone intentionally bypasses 
    CODE_SENT, // if the verification code is sent successfully
    VERIFICATION_SUCCESS, // if the verification code is correct
    PASSWORD_RESET_SUCCESS, // if the password is reset successfully
    WRONG_VERIFICATION_CODE, // if the verification code is wrong
    SAME_PASSWORD, // if the new password is the same as the old password
    INTERNAL_SERVER_ERROR, // if there is an internal server error
}