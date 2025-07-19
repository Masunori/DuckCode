import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ isLogin, setIsLogin, setIsResetPassword }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    function handleToHome(event) {
        navigate('/home');
    }

    return (
        <div style={{ display: isLogin ? "block" : "none" }}>
            <div className='login-signup-fullscreen' ></div>
            <div className='login-signup-container-border'>
                <div className="login-signup-container">
                    <button id="login-close-button" onClick={() => setIsLogin(false)}>×</button>
                    <h2>Welcome back to DuckCode!</h2>
                    <h4>Please login to continue</h4>
                    <form action='#' method='POST'>
                        <label htmlFor="login-username">
                            <p className='authentication-field-guide'>Email</p>
                            <input id="login-username" type="email" name="username" placeholder="you@domain.com" required />
                        </label>
                        <label htmlFor="login-password" id='login-password-label'>
                            <p className='authentication-field-guide'>Password</p>
                            <input id="login-password" type={isPasswordVisible ? "text" : "password"} name="password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        
                        <p id='forget-password' onClick={() => setIsResetPassword(true)}>Forgot your password?</p>

                        <button id="login-button" onClick={handleToHome} type="button">Login</button>

                        <div className="login-signup-options-separator">
                            <span></span>
                            <h4>OR continue with</h4>
                            <span></span>
                        </div>
                        <section className="login-signup-alternative-options">
                            <button onClick={() => window.location.href = "http://54.253.72.184/auth/google"}>Google</button>
                            <button onClick={() => window.location.href = "http://54.253.72.184/auth/github"}>GitHub</button>
                            <button>Facebook</button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}