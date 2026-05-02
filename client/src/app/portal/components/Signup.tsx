import { PortalMode } from "@/app/portal/PortalMode";
import LinearProgressBar, { cascadePostRequisites, ProgressStep } from "@/components/progressBar/LinearProgressBar";
import { SignupStatuses } from "@/lib/apiClient/portalStatuses";
import { getVerificationCode, signUp, verifyCode } from "@/lib/apiClient/user";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from '../page.module.css';
import animationStyles from "@/components/styles/animations.module.css";
import PopupOverlay from "./PopupOverlay";
import NewUsernameInput from "@/components/authInputs/NewUsernameInput";
import NewEmailInput from "@/components/authInputs/NewEmailInput";
import NewPasswordInput from "@/components/authInputs/NewPasswordInput";
import Spinner from "@/components/loading/Spinner";
import OTPInput from "@/components/inputs/OTPInput";
import { FieldState } from "@/lib/utils/fieldConditions";

type SignupProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

const SERVER_SIDE_ERROR_BORDER_COLOR = '#FF5C00';


function ResendOTPButton({ email }: { email: string }) {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (seconds > 0) {
            const t = setTimeout(() => setSeconds(prev => prev - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [seconds]);

    const handleResend = async () => {
        getVerificationCode(email);
        setSeconds(60);
    }

    return (
        <button
            className={styles.resendOtpButton}
            onClick={handleResend}
            disabled={seconds > 0}
        >
            {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
        </button>
    )
}

export default function Signup({ portalMode, setPortalMode }: SignupProps) {
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

    // tracks the state of each input field
    const [usernameInputState, setUsernameInputState] = useState(FieldState.EMPTY);
    const [emailInputState, setEmailInputState] = useState(FieldState.EMPTY);
    const [passwordInputState, setPasswordInputState] = useState(FieldState.EMPTY);
    const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(FieldState.EMPTY);

    const [signupStatus, setSignupStatus] = useState<SignupStatuses[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // form data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [otp, setOtp] = useState<string>('');
    const [isOtpValid, setIsOtpValid] = useState<boolean>(false);

    function areAllFieldsValid(): boolean {
        return usernameInputState === FieldState.VALID &&
            emailInputState === FieldState.VALID &&
            passwordInputState === FieldState.VALID &&
            confirmPasswordInputState === FieldState.VALID;
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

        setSignupStatus(null);
        setIsLoading(true);

        await signUp(
            username, email, password, confirmPassword
        )
            .then(response => {
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
                        setOtp('');
                        break;
                    default:
                        console.error(`Unexpected response status: ${response.status}`);
                }

                setIsLoading(false);
            })
            .catch(error => {
                console.error('Unexpected error:', error);
                setIsLoading(false);
            });
    }

    async function registerVerifyOtp() {
        if (!isOtpValid) {
            setSignupStatus([SignupStatuses.INVALID_CLIENT_SIDE_CREDENTIALS]);
            return;
        }

        setIsLoading(true);

        await verifyCode(email, otp)
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

                setIsLoading(false);
            })
            .catch(error => {
                console.error('Unexpected error:', error);
                setIsLoading(false);
            });
    }

    const children = (
        <div className={`${styles.popupBorder} ${animationStyles.illuminatingBorder} ${styles.registerPopupBorder}`}>
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
                            <NewUsernameInput 
                                onChangeNewUsername={setUsername}
                                onValidateNewUsername={setUsernameInputState}
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
                            <NewEmailInput 
                                onChangeNewEmail={setEmail}
                                onValidateNewEmail={setEmailInputState}
                            />
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
                            <NewPasswordInput 
                                onChangeNewPassword={setPassword}
                                onChangeConfirmPassword={setConfirmPassword}
                                onValidateNewPassword={setPasswordInputState}
                                onValidateConfirmPassword={setConfirmPasswordInputState}
                            />
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
                                disabled={!areAllFieldsValid() || isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Register'}
                            </button>
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
                        <div>
                            <p>{`We have sent a verification code to:`}</p>
                            <p>{email}</p>
                        </div>
                        <OTPInput n={6} onOtpChange={setOtp} onOtpValidate={setIsOtpValid} />
                        <ResendOTPButton email={email} />
                        <button className={styles.verifyOtpButton}
                            onClick={registerVerifyOtp}
                            disabled={!isOtpValid || isLoading}
                        >
                            {isLoading ? <Spinner /> : 'Verify OTP'}
                        </button>
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
                        <button
                            className={styles.loginButton}
                            onClick={() => {
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