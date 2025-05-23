import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { PortalMode } from "@/app/portal/PortalMode";
import PopupOverlay from "./PopupOverlay";
import styles from '../page.module.css';
import { PASSWORD_CONDITIONS } from "./fieldConditions";
import { ResetPasswordStatuses } from "@/app/api/portal/resetPassword/resetPasswordStatuses";

type ResetPasswordProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

enum FieldState {
    EMPTY,
    VALID,
    INVALID,
    SERVER_SIDE_INVALID
}

export default function ResetPassword({ portalMode, setPortalMode }: ResetPasswordProps) {
    const [otp, setOtp] = useState(new Array<string>(6).fill(''));
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpPointer, setOtpPointer] = useState(0);

    const EMPTY_STRING_BORDER_COLOR = 'var(--fourth-layer-background-color)';
    const INVALID_STRING_BORDER_COLOR = '#DC143C';
    const VALID_STRING_BORDER_COLOR = '#00FF00';
    const SERVER_SIDE_ERROR_BORDER_COLOR = '#FF5C00';

    const EMPTY_STRING_BG_COLOR = 'var(--second-layer-background-color)';
    const INVALID_STRING_BG_COLOR = '#540A1E';
    const VALID_STRING_BG_COLOR = '#008800';
    const SERVER_SIDE_ERROR_BG_COLOR = '#7C1212';

    // use to show/hide password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // tracks the state of each input field
    const [emailInputState, setEmailInputState] = useState(FieldState.EMPTY);
    const [passwordInputState, setPasswordInputState] = useState(FieldState.EMPTY);
    const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(FieldState.EMPTY);

    const [resetPasswordStatus, setResetPasswordStatus] = useState<ResetPasswordStatuses| null>(null);

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
    

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (!/^\d?$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[otpPointer] = value;
        setOtp(newOtp);

        if (value && otpPointer < otp.length - 1) {
            otpInputRefs.current[otpPointer + 1]?.focus();
            setOtpPointer(ptr => ptr + 1);
        }
    }

    const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !otp[otpPointer] && otpPointer > 0) {
            const newOtp = [...otp];
            newOtp[otpPointer - 1] = '';
            setOtp(newOtp);
            otpInputRefs.current[otpPointer - 1]?.focus();
            setOtpPointer(ptr => ptr - 1);
        }
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newPassword = event.target.value;
        setPassword(newPassword);

        let isPasswordValid = true;

        Object.entries(PASSWORD_CONDITIONS).forEach((condition, index) => {
            const el = passwordConditionsRef.current[index];
            if (el === null) return;
            
            const value = condition[1];

            if (newPassword === "") {
                el.innerText = `  ${value.name}`;
                el.style.color = 'var(--font-colour)';
            } else if (!value.checkFn(newPassword)) {
                isPasswordValid = false;
                el.innerText = `✖ ${value.name}`;
                el.style.color = INVALID_STRING_BORDER_COLOR;
            } else {
                el.innerText = `✔ ${value.name}`;
                el.style.color = VALID_STRING_BORDER_COLOR;
            }
        });

        setPasswordInputState(newPassword === '' 
            ? FieldState.EMPTY 
            : isPasswordValid
            ? FieldState.VALID 
            : FieldState.INVALID);

        // this is so that the confirm password also updates accordingly if password is changed
        if (newPassword === confirmPassword && confirmPassword !== '') {
            setConfirmPasswordInputState(FieldState.VALID);
        } else if (confirmPassword !== '' && newPassword !== confirmPassword) {
            setConfirmPasswordInputState(FieldState.INVALID);
        }
    }
    
    function handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newCfmPassword = event.target.value;
        setConfirmPassword(newCfmPassword);

        setConfirmPasswordInputState(newCfmPassword === '' || newCfmPassword.length < password.length
            ? FieldState.EMPTY 
            : newCfmPassword === password
            ? FieldState.VALID 
            : FieldState.INVALID);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newEmail = event.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

        setEmail(newEmail);

        setEmailInputState(newEmail === '' 
            ? FieldState.EMPTY 
            : emailRegex.test(newEmail)
            ? FieldState.VALID 
            : FieldState.INVALID);
    }

    // there are 3 stages in the reset password process (0-indexed)
    // 0. email verification
    // 1. otp verification
    // 2. reset password
    const [stage, setStage] = useState(0);

    function closePopup() {
        setPortalMode(PortalMode.None);
        setResetPasswordStatus(null);
        setStage(0);

        // reset all input fields
        setEmail('');
        setEmailInputState(FieldState.EMPTY);

        setOtpPointer(0);

        setPassword('');
        setConfirmPassword('');
        setPasswordInputState(FieldState.EMPTY);
        setConfirmPasswordInputState(FieldState.EMPTY);

        setOtp(new Array<string>(6).fill(''));
    }

    const sendVerificationCodeAPILink = '/api/portal/resetPassword/sendVerificationCode';
    const verifyOtpAPILink = '/api/portal/resetPassword/verifyOtp';
    const resetPasswordAPILink = '/api/portal/resetPassword/verifyNewPassword';

    async function getVerificationCode() {
        console.log("Getting verification code...");

        if (email === '' || !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email))) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            setEmailInputState(FieldState.SERVER_SIDE_INVALID);
            return;
        }

        await fetch(sendVerificationCodeAPILink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => {
            response.json().then(data => {
                setResetPasswordStatus(data.code);
            });

            if (response.status === 200) {
                setStage(1);
                setTimeout(() => {
                    otpInputRefs.current[0]?.focus();
                }, 500);
            } else {
                setEmailInputState(FieldState.SERVER_SIDE_INVALID);
            }
        });
    }

    async function verifyOtp() {
        if (otp.some(value => value === '')) {
            setResetPasswordStatus(ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
            return;
        }

        const code = otp.join('');

        await fetch(verifyOtpAPILink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        })
        .then(response => {
            response.json().then(data => {
                setResetPasswordStatus(data.code);
            });

            if (response.status === 200) {
                setStage(2);
            } 
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

        await fetch(resetPasswordAPILink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, confirmPassword }),
        })
        .then(response => {
            response.json().then(data => {
                setResetPasswordStatus(data.code);

                if (data.code === ResetPasswordStatuses.SAME_PASSWORD) {
                    setPasswordInputState(FieldState.SERVER_SIDE_INVALID);
                    setConfirmPasswordInputState(FieldState.SERVER_SIDE_INVALID);
                }
            });

            if (response.status === 200) {
                setStage(3);
            }
        });
    }

    function toLogin() {
        setStage(0);
        setResetPasswordStatus(null);

        // reset all input fields
        setEmail('');
        setEmailInputState(FieldState.EMPTY);

        setOtpPointer(0);

        setPassword('');
        setConfirmPassword('');
        setPasswordInputState(FieldState.EMPTY);
        setConfirmPasswordInputState(FieldState.EMPTY);

        setOtp(new Array<string>(6).fill(''));

        setPortalMode(PortalMode.Login);
    }

    // the user can press "Enter" at each phase instead of clicking buttons
    useEffect(() => {
        function handleEnterKey(event: KeyboardEvent) {
            if (portalMode !== PortalMode.ResetPassword) return;

            if (event.key === 'Enter') {
                if (stage === 0 && emailInputState === FieldState.VALID) {
                    getVerificationCode();
                } else if (stage === 1 && !otp.some(value => value === '')) {
                    verifyOtp();
                } else if (stage === 2 && passwordInputState === FieldState.VALID && confirmPasswordInputState === FieldState.VALID) {
                    setNewPassword();
                }
            }
        }

        window.addEventListener('keydown', handleEnterKey);

        return () => {
            window.removeEventListener('keydown', handleEnterKey);
        }
    })

    const children = (
        <div 
            className={styles.popupBorder} 
            style={{ display: portalMode === PortalMode.ResetPassword ? 'block' : 'none' }}
        >
            <div className={styles.popupHeightLimiter}>
                <button className={styles.closePopup} onClick={closePopup}>×</button>
    
                <div 
                    className={`${styles.popup} ${styles.resetPasswordPopup}`}
                    style={{
                        transform: `translateY(${stage * -25}%)`,
                        transitionDuration: '0.5s',
                    }}
                >
                    <div className={styles.emailVerification}>
                        <h2>Aw, mistakes happen...</h2>
                        <p className={styles.resetPasswordWarning}>
                            <span style={{ fontWeight: 600 }}>Reminder</span>: This process does not allow you to navigate to previous sections. 
                            To restart the reset password process, close this popup.
                        </p>
                        <p>1. Tell us your email</p>
                        <label htmlFor="signupEmail">
                            <input 
                                style={{
                                    borderColor: borderColors[emailInputState], 
                                    backgroundColor: backgroundColors[emailInputState]
                                }} 
                                id="signupEmail" 
                                type="email" 
                                name="email" 
                                value={email}
                                onChange={handleEmailChange}
                            ></input>
                        </label>
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
                            onClick={getVerificationCode}
                            disabled={emailInputState !== FieldState.VALID}
                            style={{
                                cursor: emailInputState === FieldState.VALID ? 'pointer' : 'not-allowed',
                                opacity: emailInputState === FieldState.VALID ? 1 : 0.5,
                            }}
                        >Get verification code</button>
                    </div>
                    <div className={styles.otp}>
                        <p>2. Key in the verification code here</p>
                        <div className={styles.otpInputContainer}>
                            <div 
                                className={styles.otpInputOverlay}
                                onClick={() => otpInputRefs.current[otpPointer]?.focus() }
                            ></div>
                            <div className={styles.otpInput}>
                                {otp.map((value, index) => (
                                    <label key={index} htmlFor={`verificationCode${index}`}>
                                        <input
                                            id={`verificationCode${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={value}
                                            onChange={handleOtpChange}
                                            onKeyDown={handleBackspace}
                                            ref={el => { otpInputRefs.current[index] = el; }}
                                            autoComplete="off"
                                        ></input>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={verifyOtp}
                            disabled={otp.some(value => value === '')}
                            style={{
                                cursor: otp.some(value => value === '') ? 'not-allowed' : 'pointer',
                                opacity: otp.some(value => value === '') ? 0.5 : 1,
                            }}
                        >Verify</button>
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
                        </ul>
                    </div>
                    <div className={styles.resetPassword}>
                        <label htmlFor="resetPasswordNewPassword" className={styles.passwordLabel}>
                            <p>3. Tell us your new password</p>
                            <input 
                                id="resetPasswordNewPassword" 
                                style={{
                                    borderColor: borderColors[passwordInputState], 
                                    backgroundColor: backgroundColors[passwordInputState]
                                }} 
                                type={isPasswordVisible ? "text" : "password"} 
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                            ></input>
                            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? 'Hide' : 'Show'}
                            </button>
                        </label>
                        <label htmlFor="resetPasswordNewConfirmedPasswordpConfirmPassword" className={styles.passwordLabel}>
                            <p>Confirm the new password</p>
                            <input 
                                id="resetPasswordNewConfirmedPassword" 
                                style={{
                                    borderColor: borderColors[confirmPasswordInputState], 
                                    backgroundColor: backgroundColors[confirmPasswordInputState]
                                }} 
                                type={isPasswordVisible ? "text" : "password"} 
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            ></input>
                            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? 'Hide' : 'Show'}
                            </button>
                        </label>
                        <ul>
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
                            {resetPasswordStatus === ResetPasswordStatuses.SAME_PASSWORD
                            && 
                                <li style={{
                                    color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                    fontWeight: 'bold', 
                                    margin: '0 0 1rem 0'
                                }}>
                                    New password cannot be the same as the old password! Please key in a new password.
                                </li>
                            }
                        </ul>
                        <button 
                            className={styles.resetPasswordButton} 
                            onClick={setNewPassword}
                            disabled={passwordInputState !== FieldState.VALID || confirmPasswordInputState !== FieldState.VALID}
                            style={{
                                cursor: passwordInputState !== FieldState.VALID || confirmPasswordInputState !== FieldState.VALID ? 'not-allowed' : 'pointer',
                                opacity: passwordInputState !== FieldState.VALID || confirmPasswordInputState !== FieldState.VALID ? 0.5 : 1,
                            }}
                        >Reset Password</button>
                        <ul>
                            {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                                <li key={key} ref={el => { passwordConditionsRef.current[index] = el; }}>
                                    {value.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.resetPasswordSuccess}>
                        <p style={{ marginBottom: '15%' }}>4. Your password has been reset successfully!</p>
                        <button onClick={toLogin}>Login</button>
                    </div>
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