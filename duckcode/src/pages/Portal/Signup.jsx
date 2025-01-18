import { useState, useRef, useEffect } from 'react';
import { PASSWORD_CONDITIONS } from '../../globalcomponents/constants';

export function Signup({ isSignup, setIsSignup }) {
    const EMPTY_STRING_BORDER_COLOR = 'var(--fourth-layer-background-color)';
    const INVALID_STRING_BORDER_COLOR = '#DC143C';
    const VALID_STRING_BORDER_COLOR = '#00DD00';

    const EMPTY_STRING_BG_COLOR = 'var(--second-layer-background-color)';
    const INVALID_STRING_BG_COLOR = '#640A1E';
    const VALID_STRING_BG_COLOR = '#006600';

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [usernameInputStyle, setUsernameInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });
    const [passwordInputStyle, setPasswordInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });
    const [confirmPasswordInputStyle, setConfirmPasswordInputStyle] = useState({ borderColor: EMPTY_STRING_BORDER_COLOR, backgroundColor: EMPTY_STRING_BG_COLOR });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const conditionsRef = useRef([]);

    useEffect(() => {
        // This will ensure that conditionsRef has the correct length and references.
        conditionsRef.current = conditionsRef.current.slice(0, Object.entries(PASSWORD_CONDITIONS).length);
    });

    /**
     * Dynamically check for valid username (which is an email).
     * 
     * @param {Event} event when a change in the username field is detected. 
     */
    function handleUsernameChange(event) {
        const newUsername = event.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

        setEmail(newUsername);

        if (newUsername === "") {
            setUsernameInputStyle({
                borderColor: EMPTY_STRING_BORDER_COLOR,
                backgroundColor: EMPTY_STRING_BG_COLOR
            });
        } else if (!emailRegex.test(newUsername)) {
            setUsernameInputStyle({
                borderColor: INVALID_STRING_BORDER_COLOR,
                backgroundColor: INVALID_STRING_BG_COLOR
            });
        } else {
            setUsernameInputStyle({
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

        conditionsRef.current.forEach(el => {
            if (newPassword === "") {
                el.innerText = `  ${el.innerText.replace(/^[✔✖]\s*/, '')}`;
                el.style.color = EMPTY_STRING_BORDER_COLOR;
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
                            <p style={{ textAlign: 'left', margin: '0 0 0 0.5em' }}>Email</p>
                            <input style={usernameInputStyle} id="signup-username" type="text" name="username" value={email} onChange={handleUsernameChange} placeholder="Enter your email" required />
                        </label>
                        <label htmlFor="signup-password" id='signup-password-label'>
                            <p>Password</p>
                            <input style={passwordInputStyle} id="signup-password" type={isPasswordVisible ? "text" : "password"} name="password" value={password} onChange={handlePasswordChange} placeholder="Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <label htmlFor="signup-confirm-password" id='signup-confirm-password-label'>
                            <p>Confirm Password</p>
                            <input style={confirmPasswordInputStyle} id="signup-confirm-password" type={isPasswordVisible ? "text" : "password"} name="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" required />
                            <button type='button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? "Hide" : "Show"}</button>
                        </label>
                        <ul style={{ paddingLeft: '1em' }}>
                            {Object.entries(PASSWORD_CONDITIONS).map(([key, value], index) => (
                                <li key={key} ref={el => conditionsRef.current[index] = el} data-key={key} style={{ listStyleType: 'none', transitionDuration: '0.25s' }}>
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
