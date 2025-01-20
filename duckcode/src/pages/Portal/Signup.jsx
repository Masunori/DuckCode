import { useState, useRef, useEffect } from 'react';
import { PASSWORD_CONDITIONS, USERNAME_CONDITIONS } from '../../globalcomponents/constants';

export default function Signup({ isSignup, setIsSignup }) {
    const EMPTY_STRING_BORDER_COLOR = 'var(--fourth-layer-background-color)';
    const INVALID_STRING_BORDER_COLOR = '#DC143C';
    const VALID_STRING_BORDER_COLOR = '#00DD00';

    const EMPTY_STRING_BG_COLOR = 'var(--second-layer-background-color)';
    const INVALID_STRING_BG_COLOR = '#640A1E';
    const VALID_STRING_BG_COLOR = '#006600';

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [usernameInputStyle, setUsernameInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });
    const [emailInputStyle, setEmailInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });
    const [passwordInputStyle, setPasswordInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });
    const [confirmPasswordInputStyle, setConfirmPasswordInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const usernameConditionsRef = useRef([]);
    const passwordConditionsRef = useRef([]);

    useEffect(() => {
        // This will ensure that conditionsRef has the correct length and references.
        passwordConditionsRef.current = passwordConditionsRef.current.slice(0, Object.entries(PASSWORD_CONDITIONS).length);
        usernameConditionsRef.current = usernameConditionsRef.current.slice(0, Object.entries(USERNAME_CONDITIONS).length);
    });

    /**
     * Dynamically check for valid username.
     * 
     * @param {Event} event when a change in the username field is detected. 
     */
    function handleUsernameChange(event) {
        const newUsername = event.target.value;
        setUsername(newUsername);

        let isUsernameValid = true;

        usernameConditionsRef.current.forEach(el => {
            if (newUsername === "") {
                el.innerText = `  ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = 'var(--font-colour)';
            } else if (!USERNAME_CONDITIONS[el.dataset.key].checkFn(newUsername)) {
                isUsernameValid = false;
                el.innerText = `✖ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = INVALID_STRING_BORDER_COLOR;
            } else {
                el.innerText = `✔ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = VALID_STRING_BORDER_COLOR;
            }
        });

        setUsernameInputStyle(newUsername === ""
            ? { borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR }
            : isUsernameValid
            ? { borderColor: VALID_STRING_BORDER_COLOR, backgroundColor: VALID_STRING_BG_COLOR }
            : { borderColor: INVALID_STRING_BORDER_COLOR, backgroundColor: INVALID_STRING_BG_COLOR }
        )
    }

    /**
     * Dynamically check for valid email.
     * 
     * @param {Event} event when a change in the email field is detected. 
     */
    function handleEmailChange(event) {
        const newEmail = event.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

        setEmail(newEmail);

        if (newEmail === "") {
            setEmailInputStyle({
                borderColor: EMPTY_STRING_BORDER_COLOR,
                backgroundColor: EMPTY_STRING_BG_COLOR
            });
        } else if (!emailRegex.test(newEmail)) {
            setEmailInputStyle({
                borderColor: INVALID_STRING_BORDER_COLOR,
                backgroundColor: INVALID_STRING_BG_COLOR
            });
        } else {
            setEmailInputStyle({
                borderColor: VALID_STRING_BORDER_COLOR,
                backgroundColor: VALID_STRING_BG_COLOR
            });
        }
    }

    /**
     * Dynamically check for valid password.
     * 
     * @param {Event} event when a change in the password field is detected.
     */
    function handlePasswordChange(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);

        let isPasswordValid = true;

        passwordConditionsRef.current.forEach(el => {
            if (newPassword === "") {
                el.innerText = `  ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = el.style.color = 'var(--font-colour)';
            } else if (!PASSWORD_CONDITIONS[el.dataset.key].checkFn(newPassword)) {
                isPasswordValid = false;
                el.innerText = `✖ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = INVALID_STRING_BORDER_COLOR;
            } else {
                el.innerText = `✔ ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = VALID_STRING_BORDER_COLOR;
            }
        });

        setPasswordInputStyle(newPassword === ""
            ? { borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR }
            : isPasswordValid
            ? { borderColor: VALID_STRING_BORDER_COLOR, backgroundColor: VALID_STRING_BG_COLOR }
            : { borderColor: INVALID_STRING_BORDER_COLOR, backgroundColor: INVALID_STRING_BG_COLOR }
        )
    }

    function handleConfirmPasswordChange(event) {
        const newCfmPassword = event.target.value;
        setConfirmPassword(newCfmPassword);

        if (newCfmPassword === "") {
            setConfirmPasswordInputStyle({
                borderColor: EMPTY_STRING_BORDER_COLOR,
                backgroundColor: EMPTY_STRING_BG_COLOR
            })
        } else if (newCfmPassword === password) {
            setConfirmPasswordInputStyle({
                borderColor: VALID_STRING_BORDER_COLOR,
                backgroundColor: VALID_STRING_BG_COLOR
            })
        } else {
            setConfirmPasswordInputStyle({
                borderColor: INVALID_STRING_BORDER_COLOR,
                backgroundColor: INVALID_STRING_BG_COLOR
            })
        }
    }

    return (
        <div style={{ display: isSignup ? "block" : "none" }}>
            <div className='login-signup-fullscreen' ></div>
            <div className='login-signup-container-border'>
                <div className="login-signup-container">
                    <button id="signup-close-button" onClick={() => setIsSignup(false)}>×</button>
                    <h2>Welcome to DuckCode!</h2>
                    <h4>Your journey starts here!</h4>
                    <form action='#' method='POST'>
                        <label htmlFor="signup-username">
                            <p className='authentication-field-guide'>Username</p>
                            <input style={usernameInputStyle} id="signup-username" type="text" name="username" value={username} onChange={handleUsernameChange} placeholder='Username' required />
                        </label>
                        <ul style={{ paddingLeft: '1em' }}>
                            {Object.entries(USERNAME_CONDITIONS).map(([key, value], index) => (
                                <li key={key} ref={el => usernameConditionsRef.current[index] = el} data-key={key} style={{ listStyleType: 'none', transitionDuration: '0.25s' }}>
                                   {value.name}
                                </li>
                            ))}
                        </ul>
                        <label htmlFor="signup-email">
                            <p className='authentication-field-guide'>Email</p>
                            <input style={emailInputStyle} id="signup-email" type="email" name="email" value={email} onChange={handleEmailChange} placeholder="you@domain.com" required />
                        </label>
                        <label htmlFor="signup-password" id='signup-password-label'>
                            <p className='authentication-field-guide'>Password</p>
                            <input style={passwordInputStyle} id="signup-password" type={isPasswordVisible ? "text" : "password"} name="password" value={password} onChange={handlePasswordChange} placeholder="Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <label htmlFor="signup-confirm-password" id='signup-confirm-password-label'>
                            <p className='authentication-field-guide'>Confirm Password</p>
                            <input style={confirmPasswordInputStyle} id="signup-confirm-password" type={isPasswordVisible ? "text" : "password"} name="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <ul style={{ paddingLeft: '1em' }}>
                            {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                                <li key={key} ref={el => passwordConditionsRef.current[index] = el} data-key={key} style={{ listStyleType: 'none', transitionDuration: '0.25s' }}>
                                   {value.name}
                                </li>
                            ))}
                        </ul>

                        <button id="sign-up-button" type="submit">Sign Up</button>

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
