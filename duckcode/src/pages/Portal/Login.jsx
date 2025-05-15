import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/user_auth/login';

export default function Login({ isLogin, setIsLogin, setIsResetPassword }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const fetchUser = useCallback((username, password) => {
        const f = async () => {
            try {
                const user = await login(username, password);
                console.log(user);

                navigate('/home');
            } catch (error) {
                console.error(error);
            }
        }

        console.log('Login clicked!');
        f();
    }, [navigate]);

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
                            <p className='authentication-field-guide'>Username</p>
                            <input id="login-username" type="text" name="username" onChange={(event) => setUsername(event.target.value)} placeholder="duckcode" required />
                        </label>
                        <label htmlFor="login-password" id='login-password-label'>
                            <p className='authentication-field-guide'>Password</p>
                            <input id="login-password" onChange={(event) => setPassword(event.target.value)} type={isPasswordVisible ? "text" : "password"} name="password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        
                        <p id='forget-password' onClick={() => setIsResetPassword(true)}>Forgot your password?</p>

                        <button id="login-button" onClick={() => fetchUser(username, password)} type="button">Login</button>

                        <div className="login-signup-options-separator">
                            <span></span>
                            <h4>OR continue with</h4>
                            <span></span>
                        </div>
                        <section className="login-signup-alternative-options">
                            <button onClick={() => window.location.href = `${process.env.REACT_APP_GAMEPLAY_API_HTTP}/auth/google`}>Google</button>
                            <button onClick={() => window.location.href = `${process.env.REACT_APP_GAMEPLAY_API_HTTP}/auth/github`}>GitHub</button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}