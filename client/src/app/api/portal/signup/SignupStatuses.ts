export enum SignupStatuses {
    USERNAME_TAKEN, // if the username is already taken
    EMAIL_USED, // if the email is already used
    INVALID_CLIENT_SIDE_CREDENTIALS, // if someone bypasses client-side validation
    OTP_SENT, // if registration is successful and OTP is sent
    OTP_VERIFIED, // if OTP is verified successfully
    WRONG_OTP, // if the OTP is incorrect
    INTERNAL_SERVER_ERROR, // internal server error
}