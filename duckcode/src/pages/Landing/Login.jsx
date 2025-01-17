import { useState } from 'react';

export function Login({ isLogin, setIsLogin }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div style={{ display: isLogin ? "block" : "none" }}>
            <div className='login-signup-fullscreen' ></div>
            <div className='login-signup-container-border'>
                <div className="login-signup-container">
                    <button id="login-close-button" onClick={() => setIsLogin(false)}>×</button>
                    <h2>Welcome back to DuckCode!<br /> Please login to continue.</h2>
                    <form action='#' method='POST'>
                        <label htmlFor="login-username">
                            <input id="login-username" type="text" name="username" placeholder="Enter your email" required />
                        </label>
                        <label htmlFor="login-password" id='login-password-label'>
                            <input id="login-password" type={isPasswordVisible ? "text" : "password"} name="password" placeholder="Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <a href="./gameplay">Forget your password?</a>

                        <button id="login-button" type="submit">Login</button>

                        <div className="login-signup-options-separator">
                            <span></span>
                            <h4>OR continue with</h4>
                            <span></span>
                        </div>
                        <section className="login-signup-alternative-options">
                            <button>Google</button>
                            <button>GitHub</button>
                            <button>Facebook</button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}