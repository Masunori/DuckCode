"use client";

import PopupOverlay from "@/app/portal/components/PopupOverlay";
import { PortalMode } from "@/app/portal/PortalMode"; 
import styles from '../page.module.css';
import { Dispatch, SetStateAction, useState } from "react";
import { login } from "../../../lib/apiClient/user";
import { useUserStore } from"@/app/components/contexts/UserContext";
import { User } from "@/app/userPrefs/userPrefsUtils";
import { useRouter } from "next/navigation";

type LoginProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

enum LoginStatus {
    NONE,
    EMPTY_FIELDS,
    WRONG_EMAIL_OR_PASSWORD
}

export default function Login({ portalMode, setPortalMode }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [loginError, setLoginError] = useState(LoginStatus.NONE);
    const ERROR_COLOR = '#FF5C00';

    const setUser = useUserStore(state => state.setUser);

    const router = useRouter();

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (email === '' || password === '') {
            setLoginError(LoginStatus.EMPTY_FIELDS);
            return;
        }

        await login(email, password)
        .then(response => {
            if (response.status === 401) {
                setLoginError(LoginStatus.WRONG_EMAIL_OR_PASSWORD);
                return;
            }

            setUser(response.data.user as User);
            router.push('/home');
        })
        .catch(error => {
            console.error(`An unexpected error occurred: ${error}`)
        })
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setEmail(value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setPassword(value);
    }
    
    const children = 
        <div className={styles.popupBorder}>
            <div className={styles.popup}>
                <button className={styles.closePopup} onClick={() => setPortalMode(PortalMode.None)}>×</button>

                <h2>Welcome back to DuckCode!</h2>
                <h4>Please login to continue</h4>
                <form onSubmit={handleLogin}>
                    <label htmlFor="loginEmail">
                        <p>Email</p>
                        <input 
                            id="loginEmail"
                            type="email" 
                            name="username"
                            value={email}
                            onChange={handleEmailChange}
                        ></input>
                    </label>
                    <label htmlFor="loginPassword" className={styles.passwordLabel}>
                        <p>Password</p>
                        <input 
                            id="loginPassword" 
                            type={isPasswordVisible ? "text" : "password"} 
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                        ></input>
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                    </label>
                    <ul>
                        {loginError === LoginStatus.WRONG_EMAIL_OR_PASSWORD && 
                            <li style={{ 
                                color: ERROR_COLOR,
                                fontWeight: 'bold', 
                                margin: '0 0 1rem 0' }}
                            >
                                Username or password is incorrect!
                        </li>}
                        {loginError === LoginStatus.EMPTY_FIELDS && 
                            <li style={{ 
                                color: ERROR_COLOR,
                                fontWeight: 'bold', 
                                margin: '0 0 1rem 0' }}
                            >
                                Username and password cannot be empty!
                        </li>}
                    </ul>

                    <p className={styles.forgotPassword} onClick={() => setPortalMode(PortalMode.ResetPassword)}>Forgot your password?</p>

                    <button 
                        type="submit"
                        disabled={email === '' || password === ''}
                        style={{
                            cursor: email === '' || password === '' ? 'not-allowed' : 'pointer',
                            opacity: email === '' || password === '' ? 0.5 : 1
                        }}
                    >Login</button>

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

    return (
        <PopupOverlay
            portalMode={portalMode}
            referencePortalMode={PortalMode.Login}
        >
            {children}
        </PopupOverlay>
    );
}