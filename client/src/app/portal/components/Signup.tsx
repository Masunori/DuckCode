import React, { Dispatch, SetStateAction, useState, useRef, RefObject } from "react";
import { PortalMode } from "@/app/portal/PortalMode";
import styles from '../page.module.css';
import PopupOverlay from "./PopupOverlay";
import { PASSWORD_CONDITIONS, USERNAME_CONDITIONS } from "./fieldConditions";
import { SignupStatuses } from "@/app/api/portal/signup/SignupStatuses";
import { signUp, verifyCode } from "@/lib/apiClient/user";
import LinearProgressBar, { cascadePostRequisites, ProgressStep } from "@/app/components/progressBar/LinearProgressBar";

type SignupProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

enum FieldState {
    EMPTY,
    VALID,
    INVALID,
    SERVER_SIDE_INVALID
}

function UsernameGuideTooltip({ usernameConditionsRef, focusedField }: { 
    usernameConditionsRef: RefObject<HTMLLIElement[] | null[]>,
    focusedField?: "username" | "email" | "password" | "confirmPassword" | null
}) {
    return (
        <ul 
            className={styles.usernameGuide}
            style={{
                height: focusedField === "username" ? "4rem" : "0",
                transitionDuration: "0.25s",
                overflow: "hidden",
            }}
        >
            {Object.entries(USERNAME_CONDITIONS).map(([key, value], index) => (
                <li key={key} ref={el => { usernameConditionsRef.current[index] = el; }}>
                    {value.name}
                </li>
            ))}
        </ul>
    );
}

function PasswordGuideTooltip({ passwordConditionsRef, focusedField }: { 
    passwordConditionsRef: RefObject<HTMLLIElement[] | null[]>,
    focusedField?: "username" | "email" | "password" | "confirmPassword" | null
}) {
    return (
        <ul 
            className={styles.passwordGuide}
            style={{
                height: focusedField === "password" ? "8rem" : "0",
                transitionDuration: "0.25s",
                overflow: "hidden",
            }}
        >
            {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                <li key={key} ref={el => { passwordConditionsRef.current[index] = el; }}>
                    {value.name}
                </li>
            ))}
        </ul>
    );
}

export default function Signup({ portalMode, setPortalMode }: SignupProps) {
    const EMPTY_STRING_BORDER_COLOR = 'var(--fourth-layer-background-color)';
    const INVALID_STRING_BORDER_COLOR = '#DC143C';
    const VALID_STRING_BORDER_COLOR = '#00FF00';
    const SERVER_SIDE_ERROR_BORDER_COLOR = '#FF5C00';

    const EMPTY_STRING_BG_COLOR = 'var(--second-layer-background-color)';
    const INVALID_STRING_BG_COLOR = '#540A1E';
    const VALID_STRING_BG_COLOR = '#008800';
    const SERVER_SIDE_ERROR_BG_COLOR = '#7C1212';

    // sign up phase
    const [signupProgressSteps, setSignupProgressSteps] = useState<ProgressStep[]>([
        {
            id: "registration",
            label: "Registration",
            status: "active",
            isBackwardNavigable: true
        },
        {
            id: "otp",
            label: "OTP",
            status: "unreached",
            isBackwardNavigable: true
        },
        {
            id: "success",
            label: "Success",
            status: "unreached",
            isBackwardNavigable: false
        }
    ]);

    const handleStepClick = (step: number) => {
        setSignupProgressSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[step].status = "active";
            cascadePostRequisites(newSteps, step);
            return newSteps;
        });
    }
    
    // tracks which field is being focused
    const [focusedField, setFocusedField] = useState<"username" | "email" | "password" | "confirmPassword" | null>(null);

    // use to show/hide password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // tracks the state of each input field
    const [usernameInputState, setUsernameInputState] = useState(FieldState.EMPTY);
    const [emailInputState, setEmailInputState] = useState(FieldState.EMPTY);
    const [passwordInputState, setPasswordInputState] = useState(FieldState.EMPTY);
    const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(FieldState.EMPTY);

    const [signupStatus, setSignupStatus] = useState<SignupStatuses[] | null>(null);

    // colors for the input fields based on their state
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

    // form data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [otp, setOtp] = useState(new Array<string>(6).fill(''));
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpPointer, setOtpPointer] = useState(0);

    const usernameConditionsRef: RefObject<HTMLLIElement[] | null[]> = useRef([]);
    const passwordConditionsRef: RefObject<HTMLLIElement[] | null[]> = useRef([]);

    function areAllFieldsValid(): boolean {
        return usernameInputState === FieldState.VALID &&
            emailInputState === FieldState.VALID &&
            passwordInputState === FieldState.VALID &&
            confirmPasswordInputState === FieldState.VALID;
    }

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newUsername: string = event.target.value;
        setUsername(newUsername);

        let isUsernameValid: boolean = true;
        
        Object.entries(USERNAME_CONDITIONS).forEach((condition, index) => {
            const el = usernameConditionsRef.current[index];
            if (el === null) return;

            const value = condition[1];

            if (newUsername === "") {
                el.innerText = `  ${value.name}`;
                el.style.color = 'var(--font-colour)';
            } else if (!value.checkFn(newUsername)) {
                isUsernameValid = false;
                el.innerText = `✖ ${value.name}`;
                el.style.color = INVALID_STRING_BORDER_COLOR;
            } else {
                el.innerText = `✔ ${value.name}`;
                el.style.color = VALID_STRING_BORDER_COLOR;
            }
        });

        setUsernameInputState(newUsername === '' 
            ? FieldState.EMPTY 
            : isUsernameValid 
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

    const handleOtpBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !otp[otpPointer] && otpPointer > 0) {
            const newOtp = [...otp];
            newOtp[otpPointer - 1] = '';
            setOtp(newOtp);
            otpInputRefs.current[otpPointer - 1]?.focus();
            setOtpPointer(ptr => ptr - 1);
        }
    }

    async function register(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (
            usernameInputState != FieldState.VALID
            || emailInputState != FieldState.VALID
            || passwordInputState != FieldState.VALID
            || confirmPasswordInputState != FieldState.VALID
        ) {
            setSignupStatus([SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS]);
            return;
        }

        await signUp(
            username, email, password, confirmPassword
        )
        .then(response => {
            console.log(response.status);

            switch (response.status) {
                case 400:
                    const data = response.data;

                    const errors: string[] = data.error;

                    const tempSignupStatus: SignupStatuses[] = [];

                    if (errors.includes("Email has been registered")) {
                        setEmailInputState(FieldState.SERVER_SIDE_INVALID);
                        tempSignupStatus.push(SignupStatuses.EMAIL_USED);
                    }

                    if (errors.includes("Username has been registered")) {
                        setUsernameInputState(FieldState.SERVER_SIDE_INVALID);
                        tempSignupStatus.push(SignupStatuses.USERNAME_TAKEN);
                    }

                    if (errors.includes("Username is invalid")
                        || errors.includes("Email is invalid")
                        || errors.includes("Password is invalid")
                        || errors.includes("Password and confirm password do not match")
                    ) {
                        tempSignupStatus.push(SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS);
                    }

                    setSignupStatus(tempSignupStatus);
                    break;
                case 200:
                    setSignupStatus([SignupStatuses.OTP_SENT]);
                    setSignupProgressSteps(
                        [
                            {
                                ...signupProgressSteps[0],
                                status: "completed",
                            },
                            {
                                ...signupProgressSteps[1],
                                status: "active",
                            },
                            {
                                ...signupProgressSteps[2]
                            }
                        ]
                    )
                    setOtp(new Array<string>(6).fill(''));
                    setOtpPointer(0);
                    break;
                default:
                    console.error(`Unexpected response status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Unexpected error:', error);
        });
    }
    async function registerVerifyOtp() {
        if (otp.some(value => value === '')) {
            setSignupStatus([SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS]);
            return;
        }

        await verifyCode(email, otp.join(""))
            .then(response => {
                switch (response.status) {
                    case 200: 
                        setSignupStatus([SignupStatuses.OTP_VERIFIED]);
                        setSignupProgressSteps(prev => ([
                            {
                                ...prev[0],
                                status: "completed",
                                isBackwardNavigable: false,
                            },
                            {
                                ...prev[1],
                                status: "completed",
                                isBackwardNavigable: false,
                            },
                            {
                                ...prev[2],
                                status: "active",
                                isBackwardNavigable: false,
                            }
                        ]))

                        console.log("Registration successful! Please log in.");
                        break;
                    case 400:
                        setSignupStatus([SignupStatuses.WRONG_OTP]);
                        break;
                    default:
                        setSignupStatus([SignupStatuses.INTERNAL_SERVER_ERROR]);
                }
            });
    }

    const children = (
        <div className={`${styles.popupBorder} ${styles.registerPopupBorder}`}>
            <div className={`${styles.popup} ${styles.registerPopup}`}>
                <button className={styles.closePopup} onClick={() => setPortalMode(PortalMode.None)}>×</button>
                <div className={styles.progressBarContainer}>
                    <LinearProgressBar 
                        progressSteps={signupProgressSteps}
                        onStepClick={handleStepClick}
                    />
                </div>
                {signupProgressSteps[0].status === "active" && 
                    <div className={styles.registerInfoForm}>
                        <h2>Welcome to DuckCode!</h2>
                        <h4>Your journey starts here!</h4>
                        <form action={"/api/portal/signup"} method="POST" onSubmit={register}>
                            <label htmlFor="signupUsername" className={styles.fieldWithInputGuide}>
                                <p>Username</p>
                                <input 
                                    style={{
                                        borderColor: borderColors[usernameInputState], 
                                        backgroundColor: backgroundColors[usernameInputState]
                                    }} 
                                    id="signupUsername" 
                                    type="text" 
                                    name="username" 
                                    value={username} 
                                    onChange={handleUsernameChange}
                                    onFocus={() => setFocusedField("username")}
                                    onBlur={() => setFocusedField(null)}
                                ></input>
                            </label>
                            <UsernameGuideTooltip 
                                usernameConditionsRef={usernameConditionsRef} 
                                focusedField={focusedField}
                            />
                            <ul>
                                {signupStatus?.includes(SignupStatuses.USERNAME_TAKEN) 
                                &&  
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                        fontWeight: 'bold', 
                                        margin: '0 0 1rem 0'
                                    }}>
                                        The username has already been registered.
                                    </li>
                                }
                            </ul>
                            <label htmlFor="signupEmail">
                                <p>Email</p>
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
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                ></input>
                            </label>
                            <ul>
                                {signupStatus?.includes(SignupStatuses.EMAIL_USED) 
                                &&  
                                    <li style={{
                                        color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                        fontWeight: 'bold', 
                                        margin: '0 0 1rem 0'
                                    }}>
                                        The email has already been registered.
                                    </li>
                                }
                            </ul>
                            <label htmlFor="signupPassword" className={styles.passwordLabel}>
                                <p>Password</p>
                                <input 
                                    id="signupPassword" 
                                    style={{
                                        borderColor: borderColors[passwordInputState], 
                                        backgroundColor: backgroundColors[passwordInputState]
                                    }} 
                                    type={isPasswordVisible ? "text" : "password"} 
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                ></input>
                                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} tabIndex={-1}>
                                    {isPasswordVisible ? 'Hide' : 'Show'}
                                </button>
                            </label>
                            <PasswordGuideTooltip 
                                passwordConditionsRef={passwordConditionsRef}
                                focusedField={focusedField}
                            />
                            <label htmlFor="signupConfirmPassword" className={styles.passwordLabel}>
                                <p>Confirm Password</p>
                                <input 
                                    id="signupConfirmPassword" 
                                    style={{
                                        borderColor: borderColors[confirmPasswordInputState], 
                                        backgroundColor: backgroundColors[confirmPasswordInputState]
                                    }} 
                                    type={isPasswordVisible ? "text" : "password"} 
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onFocus={() => setFocusedField("confirmPassword")}
                                    onBlur={() => setFocusedField(null)}
                                ></input>
                                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} tabIndex={-1}>
                                    {isPasswordVisible ? 'Hide' : 'Show'}
                                </button>
                            </label>
                            {signupStatus?.includes(SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS)
                            && 
                                <p style={{
                                    color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                    fontWeight: 'bold', 
                                    margin: '0 0 1rem 0'
                                }}>
                                    Someone is trying to bypass client-side validation... Request blocked!
                                </p>
                            }
                            {signupStatus?.includes(SignupStatuses.INTERNAL_SERVER_ERROR)
                            && 
                                <p style={{
                                    color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                    fontWeight: 'bold', 
                                    margin: '0 0 1rem 0'
                                }}>
                                    Internal server error. Please try again later.
                                </p>
                            }

                            <button 
                                type="submit" 
                                disabled={!areAllFieldsValid()}
                                style={{
                                    cursor: areAllFieldsValid() ? 'pointer' : 'not-allowed',
                                    opacity: areAllFieldsValid() ? 1 : 0.5
                                }}
                            >Register</button>
                        </form>
                        <div className={styles.or}>
                            <span></span>
                            <h4>OR continue with</h4>
                            <span></span>
                        </div>
                        <section className={styles.alternativeOptions}>
                            <button>Google</button>
                            <button>GitHub</button>
                        </section>
                    </div>
                }
                {signupProgressSteps[1].status === "active" &&
                <div 
                    className={styles.registerOtp}
                    style={{ overflow: "hidden" }}
                >
                    <p>We have sent a verification code to your email.</p>
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
                                        onKeyDown={handleOtpBackspace}
                                        ref={el => { otpInputRefs.current[index] = el; }}
                                        autoComplete="off"
                                    ></input>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={registerVerifyOtp}
                        disabled={otp.some(value => value === '')}
                        style={{
                            cursor: otp.some(value => value === '') ? 'not-allowed' : 'pointer',
                            opacity: otp.some(value => value === '') ? 0.5 : 1,
                        }}
                    >Verify</button>
                    <ul>
                        {signupStatus?.includes(SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS)
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
                        {signupStatus?.includes(SignupStatuses.WRONG_OTP)
                        && 
                            <li style={{
                                color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                fontWeight: 'bold', 
                                margin: '0 0 1rem 0'
                            }}>
                                Wrong verification code!
                            </li>
                        }
                        {signupStatus?.includes(SignupStatuses.INTERNAL_SERVER_ERROR)
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
                </div>}
                {signupProgressSteps[2].status === "active" &&
                    <div>
                        <h4>Registration successful!</h4>
                        <button onClick={() => {
                            setPortalMode(PortalMode.Login);
                            setSignupProgressSteps([
                                {
                                    id: "registration",
                                    label: "Registration",
                                    status: "active",
                                    isBackwardNavigable: true
                                },
                                {
                                    id: "otp",
                                    label: "OTP",
                                    status: "unreached",
                                    isBackwardNavigable: true
                                },
                                {
                                    id: "success",
                                    label: "Success",
                                    status: "unreached",
                                    isBackwardNavigable: false
                                }
                            ])
                        }}>
                            Log In
                        </button>
                    </div>
                }
            </div>
        </div>
    )

    return (
        <PopupOverlay
            portalMode={portalMode}
            referencePortalMode={PortalMode.Register}
        >
            {children}
        </PopupOverlay>
    );
}