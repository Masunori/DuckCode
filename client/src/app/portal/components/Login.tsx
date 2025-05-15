"use client";

import PopupOverlay from "@/app/portal/components/PopupOverlay";
import { PortalMode } from "@/app/portal/PortalMode"; 
import styles from '../page.module.css';
import { Dispatch, SetStateAction, useState } from "react";

type LoginProps = {
    portalMode: PortalMode;
    setPortalMode: Dispatch<SetStateAction<PortalMode>>;
}

export default function Login({ portalMode, setPortalMode }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [loginError, setLoginError] = useState(false);
    const ERROR_COLOR = '#FF5C00';

    async function login(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        await fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status === 401) {
                setLoginError(true);
            }
        })
        .catch(error => {
            console.error('Network or unexpected error:', error);
        });
    }

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setUsername(value);
        setLoginError(false);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setPassword(value);
        setLoginError(false);
    }
    
    const children = 
        <div className={styles.popupBorder}>
            <div className={styles.popup}>
                <button className={styles.closePopup} onClick={() => setPortalMode(PortalMode.None)}>×</button>

                <h2>Welcome back to DuckCode!</h2>
                <h4>Please login to continue</h4>
                <form action={"/api/portal/login"} method="POST" onSubmit={login}>
                    <label htmlFor="loginUsername">
                        <p>Username</p>
                        <input 
                            id="loginUsername"
                            type="text" 
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
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
                        {loginError && 
                            <li style={{ 
                                color: ERROR_COLOR,
                                fontWeight: 'bold', 
                                margin: '0 0 1rem 0' }}
                            >
                                Username or password is incorrect!
                        </li>}
                    </ul>

                    <p className={styles.forgotPassword} onClick={() => setPortalMode(PortalMode.ResetPassword)}>Forgot your password?</p>

                    <button type="submit">Login</button>

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