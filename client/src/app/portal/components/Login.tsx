"use client";

import PopupOverlay from "@/app/portal/components/PopupOverlay";
import { PortalMode } from "@/app/portal/PortalMode"; 
import styles from '../page.module.css';
import animationStyles from "@/components/styles/animations.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { login } from "../../../lib/apiClient/user";
import CurrentEmailInput from "@/components/authInputs/CurrentEmailInput";
import CurrentPasswordInput from "@/components/authInputs/CurrentPasswordInput";
import Spinner from "@/components/loading/Spinner";

type LoginProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

enum LoginStatus {
    NONE,
    WRONG_EMAIL_OR_PASSWORD
}

export default function Login({ portalMode, setPortalMode }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [loginError, setLoginError] = useState(LoginStatus.NONE);
    const ERROR_COLOR = '#FF5C00';

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoginError(LoginStatus.NONE);
        setIsLoading(true);

        await login(email, password)
        .then(response => {
            console.log(response);

            switch (response.status) {
                case 200:
                case 302:
                    window.location.href = "/home";
                    break
                case 401:
                    setLoginError(LoginStatus.WRONG_EMAIL_OR_PASSWORD);
                    break;
                default:
                    console.error(`Unexpected response status: ${response.status}`);
            }

            setIsLoading(false);
        })
        .catch(error => {
            console.error(`An unexpected error occurred: ${error}`)
            setIsLoading(false);
        })
    }

    const signUpOAuthWith = (provider: string) => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}auth/oauth/${provider}`;
    }
    
    const children = 
        <div className={`${styles.popupBorder} ${animationStyles.illuminatingBorder}`}>
            <div className={`${styles.popup} ${styles.loginPopup}`}>
                <button className={styles.closePopup} onClick={() => setPortalMode(PortalMode.None)}>×</button>

                <div className={styles.loginInfoForm}>
                    <h2>Welcome back to DuckCode!</h2>
                    <h4>Please login to continue</h4>
                    <form onSubmit={handleLogin}>
                        <CurrentEmailInput 
                            onChangeCurrentEmail={setEmail}
                        />
                        <CurrentPasswordInput
                            onChangeCurrentPassword={setPassword}
                        />
                        <ul>
                            {loginError === LoginStatus.WRONG_EMAIL_OR_PASSWORD && 
                                <li style={{ 
                                    color: ERROR_COLOR,
                                    fontWeight: 'bold', 
                                    margin: '0 0 1rem 0' }}
                                >
                                    Username or password is incorrect!
                            </li>}
                        </ul>

                        <p 
                            className={styles.forgotPassword} 
                            onClick={() => setPortalMode(PortalMode.ResetPassword)}
                        >Forgot your password?</p>

                        <button 
                            type="submit"
                            disabled={email === '' || password === '' || isLoading}
                        >
                            {isLoading ? <Spinner /> : 'Login'}
                        </button>
                    </form>

                    <div className={styles.or}>
                        <span></span>
                        <h4>OR continue with</h4>
                        <span></span>
                    </div>

                    <section className={styles.alternativeOptions}>
                        <button onClick={() => signUpOAuthWith("google")}>Google</button>
                        <button onClick={() => signUpOAuthWith("github")}>GitHub</button>
                    </section>
                </div>
            </div>
        </div>

    return (
        <PopupOverlay
            portalMode={portalMode}
            referencePortalMode={PortalMode.Login}
        >
            {children}
        </PopupOverlay>
    );
}