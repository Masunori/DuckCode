import React, { Dispatch, SetStateAction, useState, useRef, RefObject } from "react";
import { PortalMode } from "@/app/portal/PortalMode";
import styles from '../page.module.css';
import PopupOverlay from "./PopupOverlay";
import { PASSWORD_CONDITIONS, USERNAME_CONDITIONS } from "./fieldConditions";
import { SignupStatuses } from "@/app/api/portal/signup/SignupStatuses";
import { signUp } from "@/lib/apiClient/user";

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

export default function Signup({ portalMode, setPortalMode }: SignupProps) {
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
    const [usernameInputState, setUsernameInputState] = useState(FieldState.EMPTY);
    const [emailInputState, setEmailInputState] = useState(FieldState.EMPTY);
    const [passwordInputState, setPasswordInputState] = useState(FieldState.EMPTY);
    const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(FieldState.EMPTY);

    const [signupStatus, setSignupStatus] = useState<SignupStatuses[] | null>(null);

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

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    async function signup(event: React.FormEvent<HTMLFormElement>): Promise<void> {
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
            if (response.status === 400) {
                const data = response.data;

                const code: SignupStatuses[] = data.code;
                setSignupStatus(code);

                if (code.includes(SignupStatuses.USERNAME_TAKEN)) {
                    setUsernameInputState(FieldState.SERVER_SIDE_INVALID);
                }

                if (code.includes(SignupStatuses.EMAIL_USED)) {
                    setEmailInputState(FieldState.SERVER_SIDE_INVALID);
                }
            }
        })
        .catch(error => {
            console.error('Network or unexpected error:', error);
        });
    }

    const children = (
        <div className={styles.popupBorder}>
            <div className={styles.popup}>
                <button className={styles.closePopup} onClick={() => setPortalMode(PortalMode.None)}>×</button>

                <h2>Welcome to DuckCode!</h2>
                <h4>Your journey starts here!</h4>
                <form action={"/api/portal/signup"} method="POST" onSubmit={signup}>
                    <label htmlFor="signupUsername">
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
                        ></input>
                    </label>
                    <ul>
                        {signupStatus?.includes(SignupStatuses.USERNAME_TAKEN) 
                        && 
                            <li style={{
                                color: SERVER_SIDE_ERROR_BORDER_COLOR, 
                                fontWeight: 'bold', 
                                margin: '0 0 1rem 0'
                            }}>
                                Username already taken! Please use a different name, or log in if you already have an account.
                            </li>
                        }
                        {Object.entries(USERNAME_CONDITIONS).map(([key, value], index) => (
                            <li key={key} ref={el => { usernameConditionsRef.current[index] = el; }}>
                                {value.name}
                            </li>
                        ))}
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
                                This email is already binded to an account! Please use a different email address, or log in if you already have an account.
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
                        ></input>
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                    </label>
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
                        ></input>
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                    </label>
                    <ul>
                        {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                            <li key={key} ref={el => { passwordConditionsRef.current[index] = el; }}>
                                {value.name}
                            </li>
                        ))}
                    </ul>

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

                    <button 
                        type="submit" 
                        disabled={!areAllFieldsValid()}
                        style={{
                            cursor: areAllFieldsValid() ? 'pointer' : 'not-allowed',
                            opacity: areAllFieldsValid() ? 1 : 0.5
                        }}
                    >Register</button>

                    <div className={styles.or}>
                        <span></span>
                        <h4>OR continue with</h4>
                        <span></span>
                    </div>

                    <section className={styles.alternativeOptions}>
                        <button>Google</button>
                        <button>GitHub</button>
                    </section>
                </form>
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