export enum ResetPasswordStatuses {
    INVALID_EMAIL, // if the email is invalid
    CODE_SENT, // if the verification code is sent successfully
    VERIFICATION_SUCCESS, // if the verification code is correct
    PASSWORD_RESET_SUCCESS, // if the password is reset successfully
    WRONG_VERIFICATION_CODE, // if the verification code is wrong
    INVALID_PASSWORD, // if the password is invalid
    MISMATCH_CONFIRM_PASSWORD, // if the confirm password does not match the password
    SAME_PASSWORD // if the new password is the same as the old password
}