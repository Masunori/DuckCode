import { PortalMode } from "@/app/portal/PortalMode";
import LinearProgressBar, { cascadePostRequisites, ProgressStep } from "@/components/progressBar/LinearProgressBar";
import { ResetPasswordStatuses } from "@/lib/apiClient/portalStatuses";
import { getVerificationCode, verifyCode, verifyNewPassword } from "@/lib/apiClient/user";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldState, PASSWORD_CONDITIONS } from "../../../lib/utils/fieldConditions";
import styles from '../page.module.css';
import PopupOverlay from "./PopupOverlay";
import OTPInput from "@/components/inputs/OTPInput";
import NewPasswordInput from "@/components/authInputs/NewPasswordInput";
import Spinner from "@/components/loading/Spinner";
import CurrentEmailInput from "@/components/authInputs/CurrentEmailInput";

type ResetPasswordProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

export default function ResetPassword({ portalMode, setPortalMode }: ResetPasswordProps) {
    const [otp, setOtp] = useState<string>('');
    const [isOtpValid, setIsOtpValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const EMPTY_STRING_BORDER_COLOR = 'var(--fourth-layer-background-color)';
    const INVALID_STRING_BORDER_COLOR = '#DC143C';
    const VALID_STRING_BORDER_COLOR = '#00FF00';
    const SERVER_SIDE_ERROR_BORDER_COLOR = '#FF5C00';

    const EMPTY_STRING_BG_COLOR = 'var(--second-layer-background-color)';
    const INVALID_STRING_BG_COLOR = '#540A1E';
    const VALID_STRING_BG_COLOR = '#008800';
    const SERVER_SIDE_ERROR_BG_COLOR = '#7C1212';

    // tracks the state of each input field
    const [emailInputState, setEmailInputState] = useState(FieldState.EMPTY);
    const [passwordInputState, setPasswordInputState] = useState(FieldState.EMPTY);
    const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(FieldState.EMPTY);

    const [resetPasswordStatus, setResetPasswordStatus] = useState<ResetPasswordStatuses | null>(null);

    // renders the progress of the reset password process
    const [resetPasswordProgressSteps, setResetPasswordProgressSteps] = useState<ProgressStep[]>([
        {
            id: 'email-verification',
            label: 'Email',
            status: 'active',
            isBackwardNavigable: false
        },
        {
            id: 'otp-verification',
            label: 'OTP',
            status: 'unreached',
            isBackwardNavigable: false
        },
        {
            id: 'reset-password',
            label: 'Reset Password',
            status: 'unreached',
            isBackwardNavigable: false
        },
        {
            id: 'success',
            label: 'Success',
            status: 'unreached',
            isBackwardNavigable: false
        }
    ]);

    const handleStepClick = (step: number) => {
        setResetPasswordProgressSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[step].status = 'active';
            cascadePostRequisites(newSteps, step);
            return newSteps;
        });
    }

    const borderColors = {
        [FieldState.EMPTY]: EMPTY_STRING_BORDER_COLOR,
        [FieldState.VALID]: VALID_STRING_BORDER_COLOR,
        [FieldState.INVALID]: INVALID_STRING_BORDER_COLOR,
        [FieldState.SERVER_SIDE_INVALID]: SERVER_SIDE_ERROR_BORDER_COLOR
    }

    const backgroundColors = {
        [FieldState.EMPTY]: EMPTY_STRING_BG_COLOR,
        [FieldState.VALID]: VALID_STRING_BG_COLOR,
        [FieldState.INVALID]: INVALID_STRING_BG_COLOR,
        [FieldState.SERVER_SIDE_INVALID]: SERVER_SIDE_ERROR_BG_COLOR
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordConditionsRef: RefObject<HTMLLIElement[] | null[]> = useRef([]);

    function handleEmailChange(newEmail: string): void {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

        setEmail(newEmail);
        setEmailInputState(newEmail === ''
            ? FieldState.EMPTY
            : emailRegex.test(newEmail)
                ? FieldState.VALID
                : FieldState.INVALID
        );
    };

    function closePopup() {
        setPortalMode(PortalMode.None);
        setResetPasswordStatus(null);

        // reset all input fields
        setResetPasswordProgressSteps([
            {
                id: 'email-verification',
                label: 'Email',
                status: 'active',
                isBackwardNavigable: false
            },
            {
                id: 'otp-verification',
                label: 'OTP',
                status: 'unreached',
                isBackwardNavigable: false
            },
            {
                id: 'reset-password',
                label: 'Reset Password',
                status: 'unreached',
                isBackwardNavigable: false
            },
            {
                id: 'success',
                label: 'Success',
                status: 'unreached',
                isBackwardNavigable: false
            }
        ]);

        setEmail('');
        setEmailInputState(FieldState.EMPTY);

        setPassword('');
        setConfirmPassword('');
        setPasswordInputState(FieldState.EMPTY);
        setConfirmPasswordInputState(FieldState.EMPTY);

        setOtp('');
        setIsOtpValid(false);
    }

    async function getOTP() {
        if (email === '' || !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email))) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            setEmailInputState(FieldState.SERVER_SIDE_INVALID);
            return;
        }

        setIsLoading(true);

        await getVerificationCode(email)
            .then(response => {
                switch (response.status) {
                    case 200:
                        setResetPasswordProgressSteps(prevSteps => {
                            const newSteps = [...prevSteps];
                            newSteps[0].status = 'completed';
                            newSteps[1].status = 'active';
                            return newSteps;
                        });
                        break;
                    case 400:
                        setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
                        setEmailInputState(FieldState.SERVER_SIDE_INVALID);
                        break;
                    default:
                        console.error(`Internal server error: ${response.status}`);
                }

                setIsLoading(false);
            });
    }

    async function verifyOtp() {
        if (!isOtpValid) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            return;
        }

        setIsLoading(true);
        await verifyCode(email, otp)
            .then(response => {
                switch (response.status) {
                    case 200:
                        setResetPasswordProgressSteps(prevSteps => {
                            const newSteps = [...prevSteps];
                            newSteps[1].status = 'completed';
                            newSteps[2].status = 'active';
                            return newSteps;
                        });
                        break;
                    case 400:
                        setResetPasswordStatus(ResetPasswordStatuses.WRONG_VERIFICATION_CODE);
                        setIsOtpValid(false);
                        break;
                    default:
                        setResetPasswordStatus(ResetPasswordStatuses.INTERNAL_SERVER_ERROR);
                        console.error(`Internal server error: ${response.status}`);
                }

                setIsLoading(false);
            });
    }

    async function setNewPassword() {
        if (Object.values(PASSWORD_CONDITIONS).some(pred => !pred.checkFn(password))) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            setPasswordInputState(FieldState.SERVER_SIDE_INVALID);
            return;
        }

        if (confirmPassword !== password) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            setConfirmPasswordInputState(FieldState.SERVER_SIDE_INVALID);
            return;
        }

        setIsLoading(true);

        await verifyNewPassword(email, password, confirmPassword)
            .then(response => {
                switch (response.status) {
                    case 200:
                        console.log("Reset password successful!");
                        setResetPasswordProgressSteps(prevSteps => {
                            const newSteps = [...prevSteps];
                            newSteps[2].status = 'completed';
                            newSteps[3].status = 'active';
                            return newSteps;
                        });
                    case 400:
                        setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
                    default:
                        setResetPasswordStatus(ResetPasswordStatuses.INTERNAL_SERVER_ERROR);
                }

                setIsLoading(false);
            })
    }

    function toLogin() {
        setResetPasswordProgressSteps([
            {
                id: 'email-verification',
                label: 'Email',
                status: 'active',
                isBackwardNavigable: false
            },
            {
                id: 'otp-verification',
                label: 'OTP',
                status: 'unreached',
                isBackwardNavigable: false
            },
            {
                id: 'reset-password',
                label: 'Reset Password',
                status: 'unreached',
                isBackwardNavigable: false
            },
            {
                id: 'success',
                label: 'Success',
                status: 'unreached',
                isBackwardNavigable: false
            }
        ]);

        setResetPasswordStatus(null);

        // reset all input fields
        setEmail('');
        setEmailInputState(FieldState.EMPTY);

        setPassword('');
        setConfirmPassword('');
        setPasswordInputState(FieldState.EMPTY);
        setConfirmPasswordInputState(FieldState.EMPTY);

        setOtp('');

        setPortalMode(PortalMode.Login);
    }

    // the user can press "Enter" at each phase instead of clicking buttons
    useEffect(() => {
        function handleEnterKey(event: KeyboardEvent) {
            if (portalMode !== PortalMode.ResetPassword) return;

            if (event.key === 'Enter') {
                if (resetPasswordProgressSteps[0].status === "active" && emailInputState === FieldState.VALID) {
                    getOTP();
                } else if (resetPasswordProgressSteps[1].status === "active" && otp !== '') {
                    verifyOtp();
                } else if (resetPasswordProgressSteps[2].status === "active" && passwordInputState === FieldState.VALID && confirmPasswordInputState === FieldState.VALID) {
                    setNewPassword();
                }
            }
        }

        window.addEventListener('keydown', handleEnterKey);

        return () => {
            window.removeEventListener('keydown', handleEnterKey);
        }
    });

    const children = (
        <div
            className={styles.popupBorder}
            style={{ display: portalMode === PortalMode.ResetPassword ? 'block' : 'none' }}
        >
            <div className={`${styles.popup} ${styles.resetPasswordPopup}`}>
                <button className={styles.closePopup} onClick={closePopup}>×</button>
                <div className={styles.progressBarContainer}>
                    <LinearProgressBar
                        progressSteps={resetPasswordProgressSteps}
                        onStepClick={handleStepClick}
                    />
                </div>
                <div>
                    {resetPasswordProgressSteps[0].status === 'active' &&
                        <div className={styles.emailVerification}>
                            <h2>Aw, mistakes happen...</h2>
                            <p className={styles.resetPasswordWarning}>
                                <span style={{ fontWeight: 600 }}>Reminder</span>: This process does not allow you to navigate to previous sections.
                                To restart the reset password process, close this popup.
                            </p>
                            <CurrentEmailInput 
                                onChangeCurrentEmail={handleEmailChange}
                            />
                            {resetPasswordStatus === ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS
                                &&
                                <p style={{
                                    color: SERVER_SIDE_ERROR_BORDER_COLOR,
                                    fontWeight: 'bold',
                                    margin: '0 0 1rem 0'
                                }}>
                                    Someone is trying to bypass client-side validation...
                                    Please make sure that your email follows the conventional email format.
                                </p>
                            }
                            <button
                                onClick={getOTP}
                                disabled={emailInputState !== FieldState.VALID || isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Get verification code'}
                            </button>
                        </div>
                    }
                    {resetPasswordProgressSteps[1].status === 'active' &&
                        <div className={styles.otp}>
                            <p>A verification code has been sent to:</p>
                            <p style={{textAlign: 'center'}}>{email}</p>
                            <div className={styles.otpInputContainer}>
                                <OTPInput   
                                    n={6}
                                    onOtpChange={setOtp}
                                    onOtpValidate={setIsOtpValid} 
                                />
                            </div>
                            <button
                                onClick={verifyOtp}
                                disabled={!isOtpValid || isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Verify'}
                            </button>
                            <ul>
                                {resetPasswordStatus === ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS
                                    &&
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR,
                                        fontWeight: 'bold',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Someone is trying to bypass client-side validation...
                                        Please fill in the verification code properly!
                                    </li>
                                }
                                {resetPasswordStatus === ResetPasswordStatuses.WRONG_VERIFICATION_CODE
                                    &&
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR,
                                        fontWeight: 'bold',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Wrong verification code!
                                    </li>
                                }
                                {resetPasswordStatus === ResetPasswordStatuses.INTERNAL_SERVER_ERROR
                                    &&
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR,
                                        fontWeight: 'bold',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Internal server error. Please try again later.
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                    {resetPasswordProgressSteps[2].status === 'active' &&
                        <div className={styles.resetPassword}>
                            <NewPasswordInput 
                                onChangeNewPassword={setPassword}
                                onChangeConfirmPassword={setConfirmPassword}
                                onValidateNewPassword={setPasswordInputState}
                                onValidateConfirmPassword={setConfirmPasswordInputState}
                            />
                            <ul style={{ 'listStyleType': 'none' }}>
                                {resetPasswordStatus === ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS
                                    &&
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR,
                                        fontWeight: 'bold',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Someone is trying to bypass client-side validation... Request blocked!
                                    </li>
                                }
                            </ul>
                            <button
                                className={styles.resetPasswordButton}
                                onClick={setNewPassword}
                                disabled={passwordInputState !== FieldState.VALID || confirmPasswordInputState !== FieldState.VALID || isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Reset Password'}
                            </button>
                        </div>
                    }
                    {resetPasswordProgressSteps[3].status === 'active' &&
                        <div className={styles.resetPasswordSuccess}>
                            <p style={{ marginBottom: '15%' }}>Your password has been reset successfully!</p>
                            <button onClick={toLogin}>Login</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )

    return (
        <PopupOverlay
            portalMode={portalMode}
            referencePortalMode={PortalMode.ResetPassword}
        >
            {children}
        </PopupOverlay>
    )
}